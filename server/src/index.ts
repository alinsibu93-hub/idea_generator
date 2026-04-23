import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { AppError } from './lib/AppError';
import ideasRouter from './routes/ideas';
import chatRouter from './routes/chat';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '16kb' }));

// ─── Request logging (development) ───────────────────────────────────────────
if (config.isDevelopment) {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/ideas', ideasRouter);
app.use('/api/chat', chatRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Serve frontend in production ────────────────────────────────────────────
if (!config.isDevelopment) {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ─── Error Handler ────────────────────────────────────────────────────────────
// AppError = expected operational error → forward the status and message.
// Anything else = unexpected → log it and return a safe generic response.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('[Unhandled error]', err);
  return res.status(500).json({
    error: 'Internal server error',
    ...(config.isDevelopment && { detail: err.message }),
  });
});

app.listen(config.port, () => {
  console.log(`Idea Coach API running at http://localhost:${config.port}`);
});
