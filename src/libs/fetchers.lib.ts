const BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

interface FetcherOptions<T> {
  path: string;
  body?: BodyInit | T | null;
}

async function fetcher<TResponse, TBody = TResponse>(
  { path, body }: FetcherOptions<TBody>,
  {
    method = 'GET',
    credentials = 'include',
    headers,
    ...config
  }: RequestInit = {}
): Promise<TResponse> {
  const response = await fetch(BASE_URL + path, {
    method,
    credentials,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
    ...config,
  });

  if (!response.ok) {
    const text: string = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  if (response.status === 204) {
    return undefined as unknown as TResponse;
  }
  return response.json();
}

export async function getFetcher<T>(
  { path }: FetcherOptions<T>,
  config?: RequestInit
): Promise<T> {
  return await fetcher<T>({ path }, config);
}

export async function postFetcher<TResponse, TBody = TResponse>(
  fetchOptions: FetcherOptions<TBody>,
  config?: RequestInit
): Promise<TResponse> {
  return await fetcher<TResponse, TBody>(fetchOptions, {
    method: 'POST',
    ...config,
  });
}

export async function putFetcher<TResponse, TBody = TResponse>(
  fetchOptions: FetcherOptions<TBody>,
  config?: RequestInit
): Promise<TResponse> {
  return await fetcher<TResponse, TBody>(fetchOptions, {
    method: 'PUT',
    ...config,
  });
}

export async function patchFetcher<TResponse, TBody = TResponse>(
  fetchOptions: FetcherOptions<TBody>,
  config?: RequestInit
): Promise<TResponse> {
  return await fetcher<TResponse, TBody>(fetchOptions, {
    method: 'PATCH',
    ...config,
  });
}

export async function deleteFetcher(
  { path }: FetcherOptions<void>,
  config?: RequestInit
): Promise<void> {
  return await fetcher<void>({ path }, { method: 'DELETE', ...config });
}
