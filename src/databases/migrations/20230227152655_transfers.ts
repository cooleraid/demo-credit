import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transfers', table => {
    table.bigIncrements('id').unsigned().primary();
    table.bigInteger('sourceTransactionId').unsigned().index().references('id').inTable('transactions');
    table.bigInteger('destinationTransactionId').unsigned().index().references('id').inTable('transactions');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.boolean('deleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transfers');
}
