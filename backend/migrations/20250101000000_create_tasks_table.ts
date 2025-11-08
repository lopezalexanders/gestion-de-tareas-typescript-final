import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary();
    table.string('title', 120).notNullable();
    table.string('description', 2000);
    table.enu('status', ['pending', 'in_progress', 'done'], { useNative: false, enumName: 'task_status' }).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.raw('CREATE INDEX idx_tasks_status_created_at ON tasks (status, created_at DESC)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tasks');
}
