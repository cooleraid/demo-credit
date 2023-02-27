import { Model, ModelObject } from 'objection';
import { Transfer } from '@/interfaces/transfer.interface';
import { Transactions } from './transactions.model';

export class Transfers extends Model implements Transfer {
  id!: number;
  sourceTransactionId!: number;
  destinationTransactionId!: number;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  static tableName = 'transfers';
  static idColumn = 'id';

  static get relationMappings() {
    return {
      source: {
        relation: Model.HasOneRelation,
        modelClass: Transactions,
        join: {
          from: `transactions.id`,
          to: 'transfers.sourceTransactionId',
        },
      },
      destination: {
        relation: Model.HasOneRelation,
        modelClass: Transactions,
        join: {
          from: `transactions.id`,
          to: 'transfers.destinationTransactionId',
        },
      },
    };
  }
}

export type TransfersShape = ModelObject<Transfers>;
