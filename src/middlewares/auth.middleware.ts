import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/user.interface';
import { Users } from '@models/users.model';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (!authorization) return next(new HttpException(401, 'Unauthorized'));

    const secretKey: string = SECRET_KEY;
    const payload = (await verify(authorization, secretKey)) as DataStoredInToken;
    const userId = payload.id;
    const user: User = await Users.query().findById(userId);

    if (!user) return next(new HttpException(401, 'Unauthorized'));
    req.user = user;
    next();
  } catch (error) {
    next(new HttpException(401, 'Unauthorized'));
  }
};

export default authMiddleware;
