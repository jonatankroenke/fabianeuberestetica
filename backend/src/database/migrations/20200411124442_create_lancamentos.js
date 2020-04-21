
exports.up = function(knex) {
  return knex.schema.createTable('lancamentos', function (table) {
    table.increments();
    table.string('ds_titulo', 100).notNullable();
    table.string('vl_lancamento').notNullable();
    table.string('dt_lancamento').notNullable();
    table.string('tp_destino', 1).notNullable();
    table.string('tp_forma_pagamento', 2).notNullable();
    table.string('ds_obs', 255);
    
    table.string('id_agendamento');
    table.foreign('id_agendamento').references('id').inTable('agendamentos');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('lancamentos');
};
