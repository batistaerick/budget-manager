import { postFetcher } from '@/libs/fetchers.lib';
import type { Authentication } from '@/types';

export const authenticationService = {
  login: async ({ email, password }: Authentication): Promise<void> => {
    await postFetcher({ path: '/auth/login', body: { email, password } });
    setTimeout((): void => window.location.reload(), 500);
  },

  logout: async (): Promise<void> => {
    await postFetcher({ path: '/auth/logout' });
    setTimeout((): void => window.location.reload(), 500);
  },
};
