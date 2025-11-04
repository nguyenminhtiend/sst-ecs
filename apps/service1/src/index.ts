import express from 'express';
import { createLogger, createHttpLogger, errorHandler, notFoundHandler } from '@repo/common';
import type { HealthCheckResponse } from '@repo/types';
import { router as apiRouter } from './routes/api.js';

const logger = createLogger('service1');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(createHttpLogger('service1'));

// Health check
app.get('/health', (_req, res: express.Response<HealthCheckResponse>) => {
  res.json({
    status: 'ok',
    service: 'service1',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/service1', apiRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Service1 listening on port ${PORT}`);
});
