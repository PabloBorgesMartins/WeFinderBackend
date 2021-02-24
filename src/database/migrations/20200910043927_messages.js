exports.up = function (knex) {
  return knex.schema.createTable("messages", function (table) {
    table.increments("message_id").primary();
    table.integer("user_id").notNullable().references("id").inTable("user");
    table
      .integer("chat_id")
      .notNullable()
      .references("chat_id")
      .inTable("chats");
    table.string("message").notNullable();
    // table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
