import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import axios from 'axios';

const defaultAxios: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_HOST!,
  withCredentials: true,
});

export async function getFetcher<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return await defaultAxios
    .get<T>(url, config)
    .then((response: AxiosResponse<T>): T => response.data)
    .catch((error: AxiosError): never => {
      throw error;
    });
}

export async function postFetcher<TResponse, TBody = TResponse>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  return await defaultAxios
    .post<TResponse>(url, body, config)
    .then((response: AxiosResponse<TResponse>): TResponse => response.data)
    .catch((error: AxiosError): never => {
      throw error;
    });
}

export async function patchFetch<T>(
  url: string,
  body?: T,
  config?: AxiosRequestConfig
): Promise<T> {
  return await defaultAxios
    .patch<T>(url, body, config)
    .then((response: AxiosResponse<T>): T => response.data)
    .catch((error: AxiosError): never => {
      throw error;
    });
}
