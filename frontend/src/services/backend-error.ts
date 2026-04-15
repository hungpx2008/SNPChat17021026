/**
 * Structured error for backend API failures.
 *
 * Replaces generic `new Error("Backend request failed: ...")` with a typed
 * error that preserves HTTP status, response body, and request URL.
 */
export class BackendError extends Error {
  public readonly name = 'BackendError';

  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
    public readonly url: string,
  ) {
    super(`Backend ${status} ${statusText}: ${body}`);
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}
