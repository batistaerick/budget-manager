import { postFetcher } from '@/libs/fetchers.lib';
import type { Authentication } from '@/types';

export const userService = {
  createUser: async ({ email, password }: Authentication): Promise<void> => {
    await postFetcher('/users', { body: JSON.stringify({ email, password }) });
  },
};
