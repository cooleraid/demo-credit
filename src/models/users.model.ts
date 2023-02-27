import { Model, ModelObject } from 'objection';
import { User } from '@/interfaces/user.interface';

export class Users extends Model implements User {
  id!: number;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deleted!: Boolean;

  static tableName = 'users';
  static idColumn = 'id';

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }
}

export type UsersShape = ModelObject<Users>;
