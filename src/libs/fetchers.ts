export async function getFetcher<T>(
  url: string,
  config?: RequestInit
): Promise<T> {
  const response = await fetch(url, { method: 'GET', ...config });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

export async function postFetcher<TResponse, TBody = TResponse>(
  url: string,
  body?: TBody,
  config?: RequestInit
): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', ...(config?.headers || {}) },
    ...config,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

export async function putFetcher<T>(
  url: string,
  body?: T,
  config?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    headers: { 'Content-Type': 'application/json', ...(config?.headers || {}) },
    ...config,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

export async function deleteFetcher(
  url: string,
  config?: RequestInit
): Promise<void> {
  const response = await fetch(url, { method: 'DELETE', ...config });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}
