import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './src/config';

const dbConfig = {
  client: 'mysql2',
  connection: {
    charset: 'utf8',
    timezone: '+01:00',
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  migrations: {
    directory: 'src/databases/migrations',
    tableName: 'migrations',
  },
  seeds: {
    directory: 'src/databases/seeds',
  },
};

export default dbConfig;
