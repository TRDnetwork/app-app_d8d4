import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Trigger daily digest
 */
export const triggerDailyDigest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, this would trigger the daily digest job
    // For now,