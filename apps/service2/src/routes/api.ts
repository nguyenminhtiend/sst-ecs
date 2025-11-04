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
        message: 'Welcome to Service 2',
        service: 'service2',
      },
      timestamp: new Date().toISOString(),
    });
  })
);

interface DataItem {
  id: string;
  title: string;
  count: number;
}

router.get(
  '/data',
  asyncHandler(async (_req, res: express.Response<ApiResponse<DataItem[]>>) => {
    res.json({
      success: true,
      data: [
        { id: '1', title: 'Item 1 from Service 2', count: 10 },
        { id: '2', title: 'Item 2 from Service 2', count: 20 },
      ],
      timestamp: new Date().toISOString(),
    });
  })
);
