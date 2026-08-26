import {
  BudgetManagerApi,
  BudgetManagerClient,
} from '@budget-manager/api-client';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL must be configured.');
}

export const api = new BudgetManagerApi(new BudgetManagerClient(apiUrl));
