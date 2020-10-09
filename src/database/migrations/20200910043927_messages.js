exports.up = function (knex) {
  return knex.schema.createTable("messages", function (table) {
    table.integer("user_id").notNullable().references("id").inTable("user");
    table
      .integer("chat_id")
      .notNullable()
      .references("chat_id")
      .inTable("chats");
    table.string("message").notNullable();
    table.date("send_date").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("messages");
};
