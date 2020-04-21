const connection     = require('../database/connection');
const { addSlashes } = require('slashes');

module.exports = {

    async index(request, response) {

        const {ds_titulo, dt_inicio, dt_fim} = request.query;

        const lancamentos = await connection('lancamentos')
                        .leftJoin('agendamentos', 'agendamentos.id', '=', 'lancamentos.id_agendamento')
                        .select([
                          'lancamentos.*',
                          'agendamentos.id as id_agendamento'
                      ])
                      .where('dt_lancamento', '>=', (dt_inicio !== undefined && dt_inicio !== '') ? dt_inicio : '0000-00-00')
                      .where('dt_lancamento', '<=', (dt_fim !== undefined && dt_fim !== '') ? dt_fim : '9999-99-99')
                      .orderBy('dt_lancamento', 'desc');
        return response.json(lancamentos);
    },

    async edit(request, response) {

        const { id } = request.params;

        const agendamento = await connection('lancamentos')
                        .select('*')
                        .where('id', id).first();
        response.status(agendamento === undefined ? 404 : 200);
        return response.json(agendamento);
    },

    async create(request, response) {
      
      const { ds_titulo, dt_lancamento, vl_lancamento, tp_destino, tp_forma_pagamento, ds_obs } = request.body;
    
      const [id] = await connection('lancamentos').insert({
          'ds_titulo': ds_titulo,
          'dt_lancamento': dt_lancamento,
          'vl_lancamento': vl_lancamento,
          'tp_destino': tp_destino,
          'tp_forma_pagamento': tp_forma_pagamento,
          'ds_obs': ds_obs,
          'id_agendamento': null,
      });
      return response.json({ id });
    },

    async createLancamentoAgendamento(request, response) {
      
      const { id_agendamento } = request.body;
        
        const agendamentos = await connection('agendamentos')
                        .join('clientes', 'agendamentos.id_cliente', '=', 'clientes.id')
                        .join('tratamentos', 'agendamentos.id_tratamento', '=', 'tratamentos.id_tratamento')
                        .select([
                          'agendamentos.*',
                          'clientes.name',
                          'tratamentos.nm_tratamento',
                          'tratamentos.vl_tratamento'
                      ]).where('agendamentos.id', parseInt(id_agendamento)).limit(1);
        
        if (agendamentos.length > 0 ) {

          const [id] = await connection('lancamentos').insert({
              'ds_titulo': agendamentos[0].nm_tratamento + ' - '+ agendamentos[0].name,
              'dt_lancamento': agendamentos[0].dt_agendamento,
              'vl_lancamento': agendamentos[0].vl_tratamento,
              'tp_destino': 'E',
              'tp_forma_pagamento': 'AV',
              'ds_obs': 'Agendamento '+parseInt(agendamentos[0].id),
              'id_agendamento': parseInt(agendamentos[0].id),
          });
          return response.json({ id });

        } else {

          response.status(404);
          return response.json({'msg': 'Agendamento não localizado.'})

        }
    },

    async update(request, response) {
        
      const { id } = request.params;
      const { ds_titulo, dt_lancamento, vl_lancamento, tp_destino, tp_forma_pagamento, ds_obs } = request.body;
    
      await connection('lancamentos').update({
          'ds_titulo': ds_titulo,
          'dt_lancamento': dt_lancamento,
          'vl_lancamento': vl_lancamento,
          'tp_destino': tp_destino,
          'tp_forma_pagamento': tp_forma_pagamento,
          'ds_obs': ds_obs
      }).where('id', id);

      return response.json({ id });
    },

    async status(request, response) {

        const { id } = request.params;
        const { status } = request.body;

        const lancamento = await connection('lancamentos')
                            .update({
                                'tp_forma_pagamento': addSlashes(status)}
                            ).where('id', parseInt(id));
        return response.json(lancamento);
    },
}