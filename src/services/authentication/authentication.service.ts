import { postFetcher } from '@/libs/fetchers.lib';
import type { Authentication } from '@/types';

class AuthenticationService {
  async login({ email, password }: Authentication): Promise<void> {
    await postFetcher('/auth/login', {
      body: JSON.stringify({ email, password }),
    });
    setTimeout((): void => globalThis.location.reload(), 500);
  }

  async logout(): Promise<void> {
    await postFetcher('/auth/logout');
    setTimeout((): void => globalThis.location.reload(), 500);
  }
}

export const authenticationService = new AuthenticationService();
