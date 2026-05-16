import { deleteFetcher, postFetcher, putFetcher } from '@/libs/fetchers.lib';
import type { Saving } from '@/types';

class SavingService {
  async createSaving(saving: Omit<Saving, 'id'>): Promise<Saving> {
    return postFetcher<Saving>('/savings', {
      body: JSON.stringify(saving),
    });
  }

  async updateSaving(saving: Saving): Promise<Saving> {
    return putFetcher<Saving>('/savings', {
      body: JSON.stringify(saving),
    });
  }

  async deleteSaving(id: string): Promise<void> {
    await deleteFetcher(`/savings/${id}`);
  }
}

export const savingService = new SavingService();
