import express from 'express';
import type { ApiResponse } from '@repo/types';
import { asyncHandler } from '@repo/common';

export const router: express.Router = express.Router();

interface WelcomeData {
  message: string;
  service: string;
}

router.get(
  '/',
  asyncHandler(async (_req, res: express.Response<ApiResponse<WelcomeData>>) => {
    res.json({
      success: true,
      data: {
        message: 'Welcome to Service 1',
        service: 'service1',
      },
      timestamp: new Date().toISOString(),
    });
  })
);

interface ExampleData {
  id: string;
  name: string;
  value: number;
}

router.get(
  '/example',
  asyncHandler(async (_req, res: express.Response<ApiResponse<ExampleData>>) => {
    res.json({
      success: true,
      data: {
        id: '1',
        name: 'Example from Service 1',
        value: 100,
      },
      timestamp: new Date().toISOString(),
    });
  })
);
