import Knex from 'knex';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from '@config';

const db = Knex({
  client: 'mysql',
  useNullAsDefault: true,
  connection: {
    charset: 'utf8',
    timezone: 'UTC+1',
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

export default db;
