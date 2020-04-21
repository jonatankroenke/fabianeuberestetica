
exports.up = function(knex) {
  return knex.schema.createTable('agendamentos', function (table) {
    table.increments();
    table.string('dt_agendamento').notNullable();
    table.string('hr_de').notNullable();
    table.string('hr_ate').notNullable();

    table.string('id_cliente').notNullable();
    table.foreign('id_cliente').references('id').inTable('clientes');
    
    table.string('id_tratamento').notNullable();
    table.foreign('id_tratamento').references('id_tratamento').inTable('tratamentos');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('agendamentos');
};
