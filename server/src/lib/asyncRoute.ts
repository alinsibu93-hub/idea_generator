import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async route handler so that any thrown error (including AppError)
 * is forwarded to Express's error-handling middleware automatically.
 * Eliminates the try/catch boilerplate that would otherwise appear in every route.
 */
export function asyncRoute(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
