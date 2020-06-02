import Knex from 'knex'

export async function up(knex: Knex) {
   return knex.schema.createTable('items', table => {
      table.uuid('id').primary()
      table.string('image').notNullable();
      table.string('title')
   })
}

export async function down(knex: Knex) {
   return knex.schema.dropTable('items')
}
