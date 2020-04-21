
exports.up = function(knex) {
    return knex.schema.createTable('tratamentos', function (table) {
        table.increments('id_tratamento');
        table.string('nm_tratamento').notNullable();
        table.string('ds_tratamento').notNullable();
        table.decimal('vl_tratamento').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tratamentos')
};
