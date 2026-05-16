function getBaseUrl(): string {
  const baseUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  return baseUrl;
}

let csrfToken: string | undefined;

function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  return document.cookie
    .split('; ')
    .find((cookie: string): boolean => cookie.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

function isUnsafeMethod(method: string): boolean {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
}

async function ensureCsrfToken(): Promise<void> {
  if (csrfToken && getCookieValue('csrf_token')) {
    return;
  }
  const response = await fetch(`${getBaseUrl()}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const text: string = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  const body = (await response.json()) as { token?: string };
  csrfToken = body.token ?? getCookieValue('csrf_token');
}

function buildHeaders(
  method: string,
  body: BodyInit | null | undefined,
  headers?: HeadersInit
): Headers {
  const result = new Headers(headers);

  if (body && !result.has('Content-Type') && !(body instanceof FormData)) {
    result.set('Content-Type', 'application/json');
  }
  if (isUnsafeMethod(method)) {
    const token = csrfToken ?? getCookieValue('csrf_token');
    if (token && !result.has('X-CSRF-Token')) {
      result.set('X-CSRF-Token', decodeURIComponent(token));
    }
  }
  return result;
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
  if (isUnsafeMethod(method)) {
    await ensureCsrfToken();
  }
  const headersInit: Headers = buildHeaders(method, config.body, headers);
  const request: RequestInit = {
    method,
    credentials,
    headers: headersInit,
    ...config,
  };
  let response = await fetch(getBaseUrl() + path, request);

  if (response.status === 403 && isUnsafeMethod(method)) {
    csrfToken = undefined;
    await ensureCsrfToken();
    request.headers = buildHeaders(method, config.body, headers);
    response = await fetch(getBaseUrl() + path, request);
  }
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
