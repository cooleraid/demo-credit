import { User } from '@/interfaces/user.interface';
import { Wallets } from '@/models/wallets.model';
import { Wallet } from '@/interfaces/wallet.interface';
import { FundWalletDto, TransferFundsDto, WithdrawFundsDto } from '@/dtos/wallets.dto';
import { raw } from 'objection';
import { Transactions } from '@/models/transactions.model';
import { HttpException } from '@/exceptions/HttpException';
import { Users } from '@/models/users.model';
import { Transfers } from '@/models/transfers.model';
import { Transaction } from '@/interfaces/transaction.interface';

class WalletService {
  public async fetchWallet(user: User): Promise<Wallets> {
    let wallet: Wallets = await Wallets.query().findOne({ userId: user.id, deleted: false });
    if (!wallet) {
      wallet = await Wallets.query().insertAndFetch({ userId: user.id, balance: 0 });
    }
    return wallet;
  }

  public async fetchUserByEmail(email: string): Promise<User> {
    const user: User = await Users.query().findOne({ email, deleted: false });
    if (!user) throw new HttpException(400, `Recipient not found`);
    return user;
  }

  public async fundWallet(user: User, payload: FundWalletDto): Promise<Wallet> {
    const trx = await Wallets.startTransaction();
    try {
      let wallet: Wallets = await this.fetchWallet(user);
      const transaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: user.id,
        direction: 'credit',
        type: 'fund',
        status: 'pending',
        amount: +payload.amount,
      });
      wallet = await wallet.$query(trx).patchAndFetch({ balance: raw('balance + :amount', { amount: +payload.amount }) });

      await transaction.$query(trx).patchAndFetch({ status: 'success' });
      await trx.commit();
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(500, `Unable to fund wallet`);
    }
  }

  public async withdrawFunds(user: User, payload: WithdrawFundsDto): Promise<Wallet> {
    const trx = await Wallets.startTransaction();
    try {
      let wallet: Wallets = await this.fetchWallet(user);
      const transaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: user.id,
        direction: 'debit',
        type: 'withdraw',
        status: 'pending',
        amount: +payload.amount,
      });
      wallet = await wallet
        .$query(trx)
        .patchAndFetch({ balance: raw('balance - :amount', { amount: +payload.amount }) })
        .where('balance', '>=', +payload.amount);
      if (!wallet) {
        await trx.rollback();
        throw new HttpException(400, `Insufficient funds`);
      }

      await transaction.$query(trx).patchAndFetch({ status: 'success' });
      await trx.commit();
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error?.message || `Unable to withdraw funds`);
    }
  }

  public async transferFunds(user: User, payload: TransferFundsDto): Promise<Wallet> {
    const trx = await Wallets.startTransaction();
    try {
      if (payload.email === user.email) throw new HttpException(400, `Cannot transfer to self`);

      const destination: User = await this.fetchUserByEmail(payload.email);
      let wallet: Wallets = await this.fetchWallet(user);
      const transaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: user.id,
        direction: 'debit',
        type: 'transfer',
        status: 'pending',
        amount: +payload.amount,
      });
      wallet = await wallet
        .$query(trx)
        .patchAndFetch({ balance: raw('balance - :amount', { amount: +payload.amount }) })
        .where('balance', '>=', +payload.amount);
      if (!wallet) {
        await trx.rollback();
        throw new HttpException(400, `Insufficient funds`);
      }
      await transaction.$query(trx).patchAndFetch({ status: 'success' });

      const destinationWallet: Wallets = await this.fetchWallet(destination);
      const destinationTransaction: Transactions = await Transactions.query(trx).insertAndFetch({
        userId: destination.id,
        direction: 'credit',
        type: 'transfer',
        status: 'pending',
        amount: +payload.amount,
      });
      await destinationWallet.$query(trx).patchAndFetch({ balance: raw('balance + :amount', { amount: +payload.amount }) });
      await destinationTransaction.$query(trx).patchAndFetch({ status: 'success' });

      await Transfers.query(trx).insertAndFetch({ sourceTransactionId: transaction.id, destinationTransactionId: destinationTransaction.id });

      await trx.commit();
      return wallet;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(400, error?.message || `Unable to withdraw funds`);
    }
  }

  public async fetchTransactions(user: User): Promise<Transaction[]> {
    const transactions: Transaction[] = await Transactions.query()
      .where({ userId: user.id, deleted: false })
      .withGraphFetched({
        transferSource: { destination: { user: true } },
        transferDestination: { source: { user: true } },
      });
    return transactions;
  }
}

export default WalletService;
