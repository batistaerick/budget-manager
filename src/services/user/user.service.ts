import { postFetcher } from '@/libs/fetchers.lib';
import type { Authentication } from '@/types';

class UserService {
  async createUser({ email, password }: Authentication): Promise<void> {
    await postFetcher('/users', { body: JSON.stringify({ email, password }) });
  }
}

export const userService = new UserService();
