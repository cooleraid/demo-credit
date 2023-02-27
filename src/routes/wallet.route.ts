import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import WalletController from '@/controllers/wallet.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { FundWalletDto, TransferFundsDto, WithdrawFundsDto } from '@/dtos/wallets.dto';

class WalletRoute implements Routes {
  public path = '/wallet/';
  public router = Router();
  public walletController = new WalletController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.walletController.getWallet);
    this.router.post(`${this.path}fund`, authMiddleware, validationMiddleware(FundWalletDto, 'body'), this.walletController.fundWallet);
    this.router.post(`${this.path}withdraw`, authMiddleware, validationMiddleware(WithdrawFundsDto, 'body'), this.walletController.withdrawFunds);
    this.router.post(`${this.path}transfer`, authMiddleware, validationMiddleware(TransferFundsDto, 'body'), this.walletController.transferFunds);
    this.router.get(`${this.path}transactions`, authMiddleware, this.walletController.fetchTransactions);
  }
}

export default WalletRoute;
