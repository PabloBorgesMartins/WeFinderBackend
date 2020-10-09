exports.up = function (knex) {
  return knex.schema.createTable("chats", function (table) {
    table.increments("chat_id").primary();
    table.integer("userPrimary").notNullable().references("id").inTable("user");
    table
      .integer("userSecondary")
      .notNullable()
      .references("id")
      .inTable("user");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("chats");
};
