function getBaseUrl(): string {
  const baseUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return baseUrl;
}

async function fetcher<T>(
  path: string,
  {
    method = 'GET',
    credentials = 'include',
    headers,
    ...config
  }: RequestInit = {}
): Promise<T> {
  let headersInit: HeadersInit | undefined = headers;

  if (!headersInit && !(config.body instanceof FormData)) {
    headersInit = { 'Content-Type': 'application/json' };
  }
  const response = await fetch(getBaseUrl() + path, {
    method,
    credentials,
    headers: headersInit,
    ...config,
  });

  if (!response.ok) {
    const text: string = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  if (response.status === 204) {
    return undefined as unknown as T;
  }
  return (await response.json()) as T;
}

export async function getBlobFetcher(path: string): Promise<Blob> {
  const response = await fetch(getBaseUrl() + path, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const text: string = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.blob();
}

export async function getFetcher<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  return await fetcher<T>(path, config);
}

export async function postFetcher<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  return await fetcher<T>(path, { method: 'POST', ...config });
}

export async function putFetcher<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  return await fetcher<T>(path, { method: 'PUT', ...config });
}

export async function patchFetcher<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  return await fetcher<T>(path, { method: 'PATCH', ...config });
}

export async function deleteFetcher(
  path: string,
  config?: RequestInit
): Promise<void> {
  await fetcher<void>(path, { method: 'DELETE', ...config });
}
