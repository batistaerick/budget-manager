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

export default function Profile(): JSX.Element {
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
          lastModified: new Date().getTime(),
        });
        const formData = new FormData();
        formData.append('file', imageFile, imageFile.name);

        await postFetcher<FormData>('/user-image', { body: formData });
      }
      if (updatedUser.name || updatedUser.password) {
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
      (prevUpdatedUser: UpdatedUser): UpdatedUser => ({
        ...prevUpdatedUser,
        [id]: value,
      })
    );
  }

  function handleChangeImage({
    currentTarget: { files },
  }: ChangeEvent<HTMLInputElement>): void {
    const file: File | undefined = files?.[0];
    file && setUpdatedImage(file);
  }

  const isSaveButtonDisabled: boolean = useMemo<boolean>(
    (): boolean =>
      !arePasswordsEqual(updatedUser.password, updatedUser.confirmPassword) ||
      !hasValueInside({ ...updatedUser, updatedImage }),
    [updatedImage, updatedUser]
  );

  console.log('HERE', profileImage);

  return (
    <div className="flex gap-10 sm:flex sm:space-y-0">
      <div className="flex w-full flex-col items-center gap-5">
        <label
          className={clsx(
            'h-40 w-40 cursor-pointer rounded-full transition duration-500',
            updatedImage || profileImage
              ? 'bg-none'
              : 'bg-slate-400 hover:bg-slate-500'
          )}
        >
          <input
            className="hidden"
            id="image"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleChangeImage}
          />
          {updatedImage && (
            <Image
              src={URL.createObjectURL(updatedImage)}
              className="size-full rounded-full object-cover"
              width={0}
              height={0}
              alt="Choose your image"
            />
          )}
          {!updatedImage && profileImage && (
            <Image
              src={URL.createObjectURL(profileImage)}
              className="size-full rounded-full object-cover"
              width={0}
              height={0}
              alt="Choose your image"
            />
          )}
          {!updatedImage && !profileImage && (
            <span className="flex size-full items-center justify-center">
              Choose your image
            </span>
          )}
        </label>
        <div>
          {currentUser?.name && (
            <div>&#128515; {`Hi ${currentUser?.name}`}</div>
          )}
          <div>{currentUser?.email}</div>
        </div>
      </div>
      <form
        className="flex w-[350px] flex-col gap-5 sm:w-[400px]"
        id="updateUserForm"
        onSubmit={onSubmit}
      >
        <Input
          id="firstName"
          label="Name"
          type="text"
          value={updatedUser?.name}
          onChange={handleChange}
        />
        <div
          className={clsx(unauthorized && 'rounded-md border border-red-400')}
        >
          <Input
            id="password"
            label="Password"
            type="password"
            value={updatedUser?.password}
            onChange={handleChange}
          />
        </div>
        <div
          className={clsx(unauthorized && 'rounded-md border border-red-400')}
        >
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={updatedUser?.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {unauthorized && <div className="text-white">Unauthorized</div>}
        <div className="flex w-[350px] items-center justify-center gap-3 sm:w-[400px]">
          <button
            className="h-12 w-full cursor-pointer rounded-md bg-blue-900 text-lg font-bold hover:bg-blue-950"
            type="button"
            onClick={(): void => push('/')}
          >
            Cancel
          </button>
          <button
            className={clsx(
              'h-12 w-full rounded-md text-lg font-bold',
              isSaveButtonDisabled
                ? 'bg-blue-950 text-gray-400'
                : 'cursor-pointer bg-blue-900 hover:bg-blue-950'
            )}
            disabled={isSaveButtonDisabled}
            type="submit"
            form="updateUserForm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
