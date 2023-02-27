import { Model, ModelObject } from 'objection';
import { Wallet } from '@/interfaces/wallet.interface';
import { Users } from './users.model';

export class Wallets extends Model implements Wallet {
  id!: number;
  balance!: number;
  userId!: number;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  static tableName = 'wallets';
  static idColumn = 'id';

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: Users,
        join: {
          from: `users.id`,
          to: 'wallets.userId',
        },
      },
    };
  }
}

export type WalletsShape = ModelObject<Wallets>;
