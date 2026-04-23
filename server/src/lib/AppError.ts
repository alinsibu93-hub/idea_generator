/**
 * Represents an expected operational error (bad input, not found, etc.).
 * The global error handler distinguishes these from unexpected failures and
 * forwards the status code directly to the HTTP response.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}
