'use client';

import Input from '@/components/Input';
import { createUser, login } from '@/security/auth';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
  type KeyboardEvent,
} from 'react';

export default function Login(): JSX.Element {
  const [isError, setIsError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [variant, setVariant] = useState<string>('login');

  const toggleVariant: () => void = useCallback(
    (): void =>
      setVariant((currentVariant: string): 'login' | 'register' =>
        currentVariant === 'login' ? 'register' : 'login'
      ),
    []
  );

  const register: () => Promise<void> = useCallback(async (): Promise<void> => {
    try {
      await createUser({ email, password });
      await login({ email, password });
    } catch (error: unknown) {
      console.error(error);
      setIsError(true);
    }
  }, [email, password]);

  async function onClick(event?: FormEvent): Promise<void> {
    event?.preventDefault();

    if (variant === 'login') {
      await login({ email, password });
    } else {
      await register();
    }
  }

  async function onKeyDown({
    key,
  }: KeyboardEvent<HTMLInputElement>): Promise<void> {
    if (key === 'Enter') {
      await onClick();
    }
  }

  return (
    <div className="relative h-screen w-screen bg-[url('/images/AuthBackground.jpg')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div className="flex h-screen w-screen items-center justify-center bg-black/50">
        <div className="sm:bg-opacity-90 max-w-md self-center rounded-3xl px-16 pt-5 pb-16 transition-colors duration-500 sm:bg-slate-950 lg:mt-2 lg:w-2/5">
          <h2 className="mb-8 flex items-center justify-center text-4xl font-semibold">
            {variant === 'login' ? 'Sign-in' : 'Sign-up'}
          </h2>
          <div className="flex flex-col gap-4">
            {variant === 'register' && (
              <Input
                id="email"
                label="Name"
                type="text"
                value={name}
                onChange={({
                  currentTarget: { value },
                }: ChangeEvent<HTMLInputElement>): void => setName(value)}
              />
            )}
            <div className={`${isError && 'rounded-md border border-red-400'}`}>
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={({
                  currentTarget: { value },
                }: ChangeEvent<HTMLInputElement>): void => setEmail(value)}
                onKeyDown={onKeyDown}
              />
            </div>
            <div className={`${isError && 'rounded-md border border-red-400'}`}>
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={({
                  currentTarget: { value },
                }: ChangeEvent<HTMLInputElement>): void => setPassword(value)}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
          <div className="mt-10">
            <button
              className="h-12 w-full cursor-pointer rounded-md bg-blue-950 text-lg font-bold"
              disabled={!password.length}
              onClick={onClick}
            >
              {variant === 'login' ? 'Login' : 'Sign-up'}
            </button>
          </div>
          <div className="mt-8 flex flex-row items-center justify-center gap-4">
            {/* <FcGoogle
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white transition hover:opacity-80"
              size={30}
              onClick={(): Promise<void> =>
                signIn('google', { callbackUrl: '/' })
              }
            />
            <BsGithub
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:opacity-80"
              size={30}
              onClick={(): Promise<void> =>
                signIn('github', { callbackUrl: '/' })
              }
            /> */}
          </div>
          <p className="mt-12 flex items-center justify-center text-neutral-500">
            {variant === 'login' ? 'New in here' : 'Already Have An Account'}
            <button
              className="ml-1 cursor-pointer hover:underline"
              onClick={toggleVariant}
            >
              {variant === 'login' ? 'Sign-up' : 'Sign-in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
