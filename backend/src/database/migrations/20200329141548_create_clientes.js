
exports.up = function(knex) {
    return knex.schema.createTable('clientes', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();

        /* table.string('ong_id').notNullable();
        table.foreign('ong_id').references('id').inTable('ongs'); */
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('clientes');
};
