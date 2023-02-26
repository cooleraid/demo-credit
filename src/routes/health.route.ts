import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import HealthController from '@/controllers/health.controller';

class HealthRoute implements Routes {
  public path = '/';
  public router = Router();
  public healthController = new HealthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.healthController.health);
    this.router.get(`${this.path}health`, this.healthController.health);
  }
}

export default HealthRoute;
