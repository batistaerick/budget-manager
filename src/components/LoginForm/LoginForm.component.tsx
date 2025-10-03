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
      <h2 className="mb-8 text-center text-3xl font-bold text-white">
        {variant === 'login' ? 'Sign In' : 'Sign Up'}
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
        <div className={clsx('rounded-md', isError && 'border border-red-400')}>
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
        <div className={clsx('rounded-md', isError && 'border border-red-400')}>
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
      <div className="mt-8">
        <button
          className={clsx(
            'h-12 w-full rounded-md text-lg font-bold text-white transition-all duration-300',
            !password.length
              ? 'cursor-not-allowed bg-gray-700'
              : 'cursor-pointer bg-blue-600 hover:bg-blue-700'
          )}
          disabled={!password.length}
          onClick={onClick}
        >
          {variant === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </div>
      <p className="mt-6 text-center text-gray-300">
        {variant === 'login'
          ? "Don't have an account?"
          : 'Already have an account?'}
        <button
          className="ml-1 cursor-pointer font-semibold text-blue-400 hover:underline"
          onClick={toggleVariant}
        >
          {variant === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </>
  );
}
