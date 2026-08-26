import { z } from 'zod';

const errorSchema = z.object({ message: z.string().optional() }).passthrough();

interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly body?: unknown;
  readonly headers?: Readonly<Record<string, string>>;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class BudgetManagerClient {
  private csrfToken: string | undefined;

  constructor(private readonly baseUrl: string) {
    if (!baseUrl) {
      throw new Error('A Budget Manager API base URL is required.');
    }
  }

  async request<T>(
    path: string,
    schema: z.ZodType<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await this.fetch(path, options);
    const payload: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      const parsed = errorSchema.safeParse(payload);
      throw new ApiClientError(
        parsed.success && parsed.data.message
          ? parsed.data.message
          : `Request failed with status ${response.status}.`,
        response.status
      );
    }
    return schema.parse(payload);
  }

  async command(path: string, options: RequestOptions): Promise<void> {
    const response = await this.fetch(path, options);
    if (!response.ok) {
      throw new ApiClientError(
        `Request failed with status ${response.status}.`,
        response.status
      );
    }
  }

  private async fetch(
    path: string,
    options: RequestOptions
  ): Promise<Response> {
    const method = options.method ?? 'GET';
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      await this.ensureCsrfToken();
    }
    const headers: Record<string, string> = { ...options.headers };
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }
    return fetch(`${this.baseUrl}${path}`, {
      method,
      credentials: 'include',
      headers,
      ...(options.body === undefined
        ? {}
        : { body: JSON.stringify(options.body) }),
    });
  }

  private async ensureCsrfToken(): Promise<void> {
    if (this.csrfToken) {
      return;
    }
    const response = await fetch(`${this.baseUrl}/auth/csrf`, {
      credentials: 'include',
    });
    const payload: unknown = await response.json().catch(() => undefined);
    this.csrfToken = z.object({ token: z.string() }).parse(payload).token;
  }
}
