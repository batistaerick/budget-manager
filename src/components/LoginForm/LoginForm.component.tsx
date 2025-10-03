'use client';

import { Input } from '@/components';
import { authenticationService, userService } from '@/services';
import clsx from 'clsx';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
  type KeyboardEvent,
} from 'react';

export default function LoginForm(): JSX.Element {
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [variant, setVariant] = useState<'login' | 'register'>('login');

  const toggleVariant: () => void = useCallback(
    (): void =>
      setVariant((variant: 'login' | 'register'): 'login' | 'register' =>
        variant === 'login' ? 'register' : 'login'
      ),
    []
  );

  const register: () => Promise<void> = useCallback(async (): Promise<void> => {
    try {
      await userService.createUser({ email, password });
      await authenticationService.login({ email, password });
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
  }, [email, password]);

  async function onClick(event?: FormEvent): Promise<void> {
    event?.preventDefault();
    if (variant === 'login') {
      await authenticationService.login({ email, password });
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
    <>
      <h2 className="mb-8 text-center text-4xl font-semibold">
        {variant === 'login' ? 'Sign-in' : 'Sign-up'}
      </h2>
      <div className="flex flex-col gap-4">
        {variant === 'register' && (
          <Input
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={({
              currentTarget: { value },
            }: ChangeEvent<HTMLInputElement>): void => setName(value)}
          />
        )}
        <div className={isError ? 'rounded-md border border-red-400' : ''}>
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
        <div className={isError ? 'rounded-md border border-red-400' : ''}>
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
          className={clsx(
            'h-12 w-full rounded-md text-lg font-bold hover:bg-blue-950',
            !password.length
              ? 'bg-blue-950 text-gray-400'
              : 'cursor-pointer bg-blue-900'
          )}
          disabled={!password.length}
          onClick={onClick}
        >
          {variant === 'login' ? 'Login' : 'Sign-up'}
        </button>
      </div>
      <p className="mt-8 text-center text-neutral-500">
        {variant === 'login' ? 'New here?' : 'Already have an account?'}
        <button
          className="ml-1 cursor-pointer hover:underline"
          onClick={toggleVariant}
        >
          {variant === 'login' ? 'Sign-up' : 'Sign-in'}
        </button>
      </p>
    </>
  );
}
