import { postFetcher } from '@/libs/fetchers.lib';
import type { Authentication } from '@/types';

export const authenticationService = {
  login: async ({ email, password }: Authentication): Promise<void> => {
    await postFetcher('/auth/login', {
      body: JSON.stringify({ email, password }),
    });
    setTimeout((): void => window.location.reload(), 500);
  },

  logout: async (): Promise<void> => {
    await postFetcher('/auth/logout');
    setTimeout((): void => window.location.reload(), 500);
  },
};
