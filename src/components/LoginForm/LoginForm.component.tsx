'use client';

import { Input } from '@/components';
import { authenticationService, userService } from '@/services';
import { isValidEmail, isValidPassword } from '@/validations/validators.util';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
  type KeyboardEvent,
} from 'react';

export default function LoginForm(): JSX.Element {
  const { push } = useRouter();
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [variant, setVariant] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const submitLabel = variant === 'login' ? 'Login' : 'Sign Up';

  const toggleVariant: () => void = useCallback(
    (): void =>
      setVariant((variant: 'login' | 'register'): 'login' | 'register' =>
        variant === 'login' ? 'register' : 'login'
      ),
    []
  );

  const register: () => Promise<void> = useCallback(async (): Promise<void> => {
    await userService.createUser({ email, name, password });
    await authenticationService.login({ email, password });
  }, [email, name, password]);

  async function onClick(event?: FormEvent): Promise<void> {
    event?.preventDefault();
    setIsError(false);
    setErrorMessage('');

    if (!isValidEmail(email)) {
      setIsError(true);
      setErrorMessage('Enter a valid email address.');
      return;
    }
    if (variant === 'register' && !isValidPassword(password)) {
      setIsError(true);
      setErrorMessage(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      if (variant === 'login') {
        await authenticationService.login({ email, password });
      } else {
        await register();
      }
      push('/');
    } catch (error: unknown) {
      console.error(error);
      setIsError(true);
      setErrorMessage(
        variant === 'login'
          ? 'Unable to sign in with those credentials.'
          : 'Unable to create your account.'
      );
    } finally {
      setIsSubmitting(false);
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
        {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
      </div>
      <div className="mt-8">
        <button
          className={clsx(
            'h-12 w-full rounded-md text-lg font-bold text-white transition-all duration-300',
            password.length && !isSubmitting
              ? 'cursor-pointer bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-700'
          )}
          disabled={!password.length || isSubmitting}
          onClick={onClick}
        >
          {isSubmitting ? 'Please wait...' : submitLabel}
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
