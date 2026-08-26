'use client';

import { Input } from '@/components';
import { useCurrentUser, useProfileImage } from '@/hooks';
import { deleteFetcher, postFetcher, putFetcher } from '@/libs/fetchers.lib';
import {
  arePasswordsEqual,
  hasValueInside,
  isValidPassword,
} from '@/validations/validators.util';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from 'react';

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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false);

  const { data: currentUser, mutate: mutateUser } = useCurrentUser();
  const { data: profileImage, mutate: mutateImage } = useProfileImage();
  const { push } = useRouter();

  const profileImageUrl: string | undefined = useMemo(():
    | string
    | undefined => {
    if (updatedImage) {
      return URL.createObjectURL(updatedImage);
    }
    if (profileImage) {
      return URL.createObjectURL(profileImage);
    }
    return undefined;
  }, [profileImage, updatedImage]);

  useEffect((): (() => void) | undefined => {
    if (!profileImageUrl) {
      return undefined;
    }

    return (): void => URL.revokeObjectURL(profileImageUrl);
  }, [profileImageUrl]);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage('');

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
        if (password && !isValidPassword(password)) {
          throw new Error('weakPassword');
        }

        const payload: Partial<Pick<UpdatedUser, 'name' | 'password'>> = {};
        if (name.trim()) {
          payload.name = name.trim();
        }
        if (password) {
          payload.password = password;
        }

        await putFetcher('/users', {
          body: JSON.stringify(payload),
        });
      }
      setUpdatedUser({ name: '', password: '', confirmPassword: '' });
      setUpdatedImage(undefined);
      await mutateImage();
      await mutateUser();
      push('/');
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error && error.message === 'differentPasswords') {
        setErrorMessage('Passwords must match.');
        return;
      }
      if (error instanceof Error && error.message === 'weakPassword') {
        setErrorMessage(
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
        );
        return;
      }
      setErrorMessage('Unable to save profile changes.');
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
    if (file) {
      setUpdatedImage(file);
    }
  }

  async function handleDeleteImage(): Promise<void> {
    setErrorMessage('');

    if (updatedImage && !profileImage) {
      setUpdatedImage(undefined);
      return;
    }

    try {
      setIsDeletingImage(true);
      await deleteFetcher('/user-image');
      setUpdatedImage(undefined);
      await mutateImage(undefined, { revalidate: false });
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage('Unable to delete profile image.');
    } finally {
      setIsDeletingImage(false);
    }
  }

  function handleUserImageRender(): JSX.Element {
    if (profileImageUrl) {
      return (
        <Image
          src={profileImageUrl}
          alt="Profile"
          fill
          className="object-cover"
        />
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--ctp-subtext0)]">
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
  const canDeleteImage: boolean = Boolean(profileImage || updatedImage);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <label className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)] transition-all hover:border-[var(--ctp-blue)] hover:shadow-lg">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleChangeImage}
          />
          {handleUserImageRender()}
        </label>
        {canDeleteImage && (
          <button
            type="button"
            onClick={handleDeleteImage}
            disabled={isDeletingImage}
            className="cursor-pointer rounded-md bg-[var(--ctp-red)]/25 px-4 py-2 text-sm font-medium text-[var(--ctp-red)] transition hover:bg-[var(--ctp-red)]/35 disabled:cursor-not-allowed disabled:bg-[var(--ctp-surface1)] disabled:text-[var(--ctp-subtext0)]"
          >
            {isDeletingImage ? 'Deleting...' : 'Delete image'}
          </button>
        )}
      </div>
      <div className="text-center">
        {currentUser?.name && (
          <h2 className="text-xl font-semibold text-[var(--ctp-text)]">
            Hello, {currentUser.name} 👋
          </h2>
        )}
        {currentUser?.email && (
          <p className="text-[var(--ctp-subtext0)]">{currentUser.email}</p>
        )}
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-[var(--ctp-surface1)] bg-[var(--ctp-surface0)]/90 p-6 shadow-md backdrop-blur-md"
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
        {errorMessage && (
          <p className="text-sm text-[var(--ctp-red)]">{errorMessage}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => push('/')}
            className="flex-1 cursor-pointer rounded-lg bg-[var(--ctp-surface1)] py-3 text-lg font-medium text-[var(--ctp-text)] transition hover:bg-[var(--ctp-surface2)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaveButtonDisabled}
            className={clsx(
              'flex-1 rounded-lg py-3 text-lg font-medium transition',
              isSaveButtonDisabled
                ? 'cursor-not-allowed bg-[var(--ctp-surface2)] text-[var(--ctp-subtext0)]'
                : 'cursor-pointer bg-[var(--ctp-surface1)] text-[var(--ctp-text)] hover:bg-[var(--ctp-surface2)]'
            )}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
