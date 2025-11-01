'use client';

import { Input } from '@/components';
import { useCurrentUser, useProfileImage } from '@/hooks';
import { postFetcher, putFetcher } from '@/libs/fetchers.lib';
import {
  arePasswordsEqual,
  hasValueInside,
} from '@/validations/validators.util';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ChangeEvent, type JSX } from 'react';

interface UpdatedUser {
  name: string;
  password: string;
  confirmPassword: string;
}

export default function ProfileForm(): JSX.Element {
  const [updatedUser, setUpdatedUser] = useState<UpdatedUser>({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [updatedImage, setUpdatedImage] = useState<Blob>();
  const [unauthorized, setUnauthorized] = useState<boolean>(false);

  const { data: currentUser, mutate: mutateUser } = useCurrentUser();
  const { data: profileImage, mutate: mutateImage } = useProfileImage();
  const { push } = useRouter();

  async function onSubmit(event: ChangeEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      const { name, password, confirmPassword } = updatedUser;

      if (updatedImage) {
        const imageFile: File = new File([updatedImage], 'image.jpeg', {
          type: updatedImage.type,
          lastModified: Date.now(),
        });
        const formData = new FormData();
        formData.append('file', imageFile, imageFile.name);
        await postFetcher<FormData>('/user-image', { body: formData });
      }
      if (name || password) {
        if (!arePasswordsEqual(password, confirmPassword)) {
          throw new Error('differentPasswords');
        }
        await putFetcher('/users', {
          body: JSON.stringify({ name, password }),
        });
      }
      setUpdatedUser({ name: '', password: '', confirmPassword: '' });
      await mutateImage();
      await mutateUser();
      push('/');
    } catch (error: unknown) {
      console.error(error);
      setUnauthorized(true);
    }
  }

  function handleChange({
    currentTarget: { value, id },
  }: ChangeEvent<HTMLInputElement>): void {
    setUpdatedUser(
      (prev: UpdatedUser): UpdatedUser => ({ ...prev, [id]: value })
    );
  }

  function handleChangeImage({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>): void {
    const file: File | undefined = files?.[0];
    file && setUpdatedImage(file);
  }

  function handleUserImageRender(): JSX.Element {
    if (updatedImage) {
      return (
        <Image
          src={URL.createObjectURL(updatedImage)}
          alt="Profile"
          fill
          className="object-cover"
        />
      );
    }
    if (profileImage) {
      return (
        <Image
          src={URL.createObjectURL(profileImage)}
          alt="Profile"
          fill
          className="object-cover"
        />
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        Choose Image
      </div>
    );
  }

  const isSaveButtonDisabled: boolean = useMemo(
    (): boolean =>
      !arePasswordsEqual(updatedUser.password, updatedUser.confirmPassword) ||
      !hasValueInside({ ...updatedUser, updatedImage }),
    [updatedImage, updatedUser]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <label className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-gray-700 bg-gray-800 transition-all hover:border-blue-500 hover:shadow-lg">
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleChangeImage}
        />
        {handleUserImageRender()}
      </label>
      <div className="text-center">
        {currentUser?.name && (
          <h2 className="text-xl font-semibold text-white">
            Hello, {currentUser.name} 👋
          </h2>
        )}
        {currentUser?.email && (
          <p className="text-gray-400">{currentUser.email}</p>
        )}
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-gray-800/90 p-6 shadow-md backdrop-blur-md"
      >
        <Input
          id="name"
          label="Name"
          type="text"
          value={updatedUser.name}
          onChange={handleChange}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={updatedUser.password}
          onChange={handleChange}
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={updatedUser.confirmPassword}
          onChange={handleChange}
        />
        {unauthorized && <p className="text-sm text-red-400">Unauthorized</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => push('/')}
            className="flex-1 cursor-pointer rounded-lg bg-gray-700 py-3 text-lg font-medium text-white transition hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className={clsx(
              'flex-1 rounded-lg py-3 text-lg font-medium transition',
              isSaveButtonDisabled
                ? 'cursor-not-allowed bg-gray-600 text-gray-400'
                : 'cursor-pointer bg-gray-700 text-white hover:bg-gray-600'
            )}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
