import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const statusCode: number = error.statusCode || 500;
    const message: string = error.message || 'Unknown Error';
    logger.error(`[${req.method}] [${req.path}] [${statusCode}] [${message}]`);
    res.status(statusCode).json({ status: error.status, message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
