exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable();
    table.string("password_hash").notNullable();
    table.string("whatsapp").notNullable().defaultTo('Sem WhatsApp');
    table.string("genre").notNullable().defaultTo('Sem Genero');

    table.string("nickname").notNullable();
    table.boolean("isTop").notNullable();
    table.boolean("isJungle").notNullable();
    table.boolean("isMid").notNullable();
    table.boolean("isAdc").notNullable();
    table.boolean("isSup").notNullable();
    table.string("champion_pool").notNullable();
    table.string("elo").notNullable();
    table.string("division").notNullable(); 
    table.boolean("representative").notNullable();
    
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

/*table.date("date_birth").notNullable();
    table.date("created_at").notNullable();
    table.date("updated_at").notNullable();
    */
