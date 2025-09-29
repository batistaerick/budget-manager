import { postFetcher } from '@/libs/fetchers';

interface AuthBody {
  email: string;
  password: string;
}

export async function login({ email, password }: AuthBody): Promise<void> {
  await postFetcher({ path: '/auth/login', body: { email, password } });
  setTimeout((): void => {
    window.location.reload();
  }, 500);
}

export async function createUser({ email, password }: AuthBody): Promise<void> {
  await postFetcher({ path: '/users', body: { email, password } });
}

export async function logout(): Promise<void> {
  await postFetcher({ path: '/auth/logout' });
  setTimeout((): void => {
    window.location.reload();
  }, 500);
}
