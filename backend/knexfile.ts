import type { Knex } from 'knex';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_PATH ?? './data/devpro_tasks.sqlite'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './migrations',
    extension: 'ts'
  }
};

export default config;
