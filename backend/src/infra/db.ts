import knex, { Knex } from 'knex';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_PATH ?? './data/devpro_tasks.sqlite'
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn: any, done: (err: Error | null, conn: any) => void) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  },
  migrations: {
    directory: new URL('../../migrations', import.meta.url).pathname,
    extension: 'ts'
  }
};

export const db = knex(config);

export const closeDb = async (): Promise<void> => {
  await db.destroy();
};
