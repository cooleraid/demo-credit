import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AuthController from '@/controllers/auth.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateUserDto, UserLoginDto } from '@/dtos/users.dto';

class AuthRoute implements Routes {
  public path = '/auth/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}register`, validationMiddleware(CreateUserDto, 'body'), this.authController.register);
    this.router.post(`${this.path}login`, validationMiddleware(UserLoginDto, 'body'), this.authController.login);
  }
}

export default AuthRoute;
