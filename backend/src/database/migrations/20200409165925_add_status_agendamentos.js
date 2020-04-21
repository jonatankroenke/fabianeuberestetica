
exports.up = function(knex) {
  return knex.schema.table('agendamentos', function (table) {
    table.string('status',1).defaultTo('P');
  })
};

exports.down = function(knex) {
  return knex.schema.table('agendamentos', function (table) {
    table.dropColumn('status');
  })
};
