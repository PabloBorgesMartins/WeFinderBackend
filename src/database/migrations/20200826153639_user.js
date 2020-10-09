exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("last_name").notNullable();
    table.string("nickname").notNullable();
    table.string("lanes").notNullable();
    table.string("champion_pool").notNullable();
    table.string("elo").notNullable();
    table.string("genre").notNullable();
    table.string("password_hash").notNullable();
    table.boolean("representative").notNullable();
    table.string("email").notNullable();
    table.string("whatsapp").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

/*table.date("date_birth").notNullable();
    table.date("created_at").notNullable();
    table.date("updated_at").notNullable();
    */
