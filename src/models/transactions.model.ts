import { Model, ModelObject } from 'objection';
import { Transaction } from '@/interfaces/transaction.interface';
import { Transfers } from './transfers.model';
import { Users } from './users.model';

export class Transactions extends Model implements Transaction {
  id!: number;
  amount!: number;
  userId!: number;
  type!: string;
  status!: string;
  direction!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  static tableName = 'transactions';
  static idColumn = 'id';

  static get relationMappings() {
    return {
      transferSource: {
        relation: Model.HasOneRelation,
        modelClass: Transfers,
        join: {
          from: `transactions.id`,
          to: 'transfers.sourceTransactionId',
        },
      },
      transferDestination: {
        relation: Model.HasOneRelation,
        modelClass: Transfers,
        join: {
          from: `transactions.id`,
          to: 'transfers.destinationTransactionId',
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: Users,
        join: {
          from: `transactions.userId`,
          to: 'users.id',
        },
      },
    };
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    if (json?.transferSource?.destination?.user) {
      json.destination = json.transferSource.destination.user;
    }
    if (json?.transferDestination?.source?.user) {
      json.source = json.transferDestination.source.user;
    }
    delete json.transferSource;
    delete json.transferDestination;
    return json;
  }
}

export type TransactionsShape = ModelObject<Transactions>;
