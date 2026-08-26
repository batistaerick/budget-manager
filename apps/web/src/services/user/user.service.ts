import { postFetcher } from '@/libs/fetchers.lib';
import type { Authentication } from '@/types';

interface CreateUser extends Authentication {
  name?: string;
}

class UserService {
  async createUser({ email, name, password }: CreateUser): Promise<void> {
    await postFetcher('/users', {
      body: JSON.stringify({ email, name, password }),
    });
  }
}

export const userService = new UserService();
