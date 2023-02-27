import { NextFunction, Response } from 'express';
import walletService from '@services/wallet.service';
import { Wallet } from '@/interfaces/wallet.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Transaction } from '@/interfaces/transaction.interface';
import { FundWalletDto, TransferFundsDto, WithdrawFundsDto } from '@/dtos/wallets.dto';

class WalletController {
  public walletService = new walletService();

  public getWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wallet: Wallet = await this.walletService.fetchWallet(req.user);
      res.status(200).json({ status: 'success', message: 'Wallet fetched successfully', data: wallet });
    } catch (error) {
      next(error);
    }
  };

  public fundWallet = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: FundWalletDto = req.body;
      const wallet: Wallet = await this.walletService.fundWallet(req.user, payload);
      res.status(200).json({ status: 'success', message: 'Wallet funded successfully', data: wallet });
    } catch (error) {
      next(error);
    }
  };

  public withdrawFunds = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: WithdrawFundsDto = req.body;
      const wallet: Wallet = await this.walletService.withdrawFunds(req.user, payload);
      res.status(200).json({ status: 'success', message: 'Funds withdrawn successfully', data: wallet });
    } catch (error) {
      next(error);
    }
  };

  public transferFunds = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload: TransferFundsDto = req.body;
      const wallet: Wallet = await this.walletService.transferFunds(req.user, payload);
      res.status(200).json({ status: 'success', message: 'Funds transferred successfully', data: wallet });
    } catch (error) {
      next(error);
    }
  };

  public fetchTransactions = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactions: Transaction[] = await this.walletService.fetchTransactions(req.user);
      res.status(200).json({ status: 'success', message: 'Transactions fetched successfully', data: transactions });
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
