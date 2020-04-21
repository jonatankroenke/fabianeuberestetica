
exports.up = function(knex) {
    return knex.schema.createTable('usuarios', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('senha').notNullable();

        /* table.string('ong_id').notNullable();
        table.foreign('ong_id').references('id').inTable('ongs'); */
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('usuarios');
};
