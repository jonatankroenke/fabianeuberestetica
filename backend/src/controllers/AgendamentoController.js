const connection     = require('../database/connection');
const { addSlashes } = require('slashes');

module.exports = {

    async index(request, response) {

        const { dt_agendamento } = request.query;
        const agendamentos = await connection('agendamentos')
                        .join('clientes', 'agendamentos.id_cliente', '=', 'clientes.id')
                        .join('tratamentos', 'agendamentos.id_tratamento', '=', 'tratamentos.id_tratamento')
                        .select([
                          'agendamentos.*',
                          'clientes.name',
                          'tratamentos.nm_tratamento'
                      ]).where('dt_agendamento', dt_agendamento).orderBy('hr_de');
        return response.json(agendamentos);
    },

    async edit(request, response) {

        const { id } = request.params;

        const agendamento = await connection('agendamentos')
                        .select('*')
                        .where('id', id).first();
        response.status(agendamento === undefined ? 404 : 200);
        return response.json(agendamento);
    },

    async create(request, response) {
        
        const { dt_agendamento, hr_de, hr_ate, id_cliente, id_tratamento } = request.body;
        
        const agendamentos = await connection('agendamentos')
                        .join('clientes', 'agendamentos.id_cliente', '=', 'clientes.id')
                        .join('tratamentos', 'agendamentos.id_tratamento', '=', 'tratamentos.id_tratamento')
                        .select([
                          'agendamentos.*',
                          'clientes.name',
                          'tratamentos.nm_tratamento'
                      ]).where('dt_agendamento', addSlashes(dt_agendamento)).orderBy('hr_de');
                      
        const filter = agendamentos.filter(trat => (
                                            (trat.hr_de < hr_de && trat.hr_ate > hr_de) 
                                            || (trat.hr_de < hr_ate && trat.hr_ate > hr_ate)
                                            || (trat.hr_de >= hr_de && trat.hr_ate <= hr_ate)
                                            ));
        
        if (filter.length > 0 ) {
            response.status(401);
            return response.json({'msg': 'Horário já utilizado para ' + filter[0].name })
        }

        const agenda = await connection('agendamentos').insert({
            'dt_agendamento': addSlashes(dt_agendamento),
            'hr_de': addSlashes(hr_de),
            'hr_ate': addSlashes(hr_ate),
            'id_cliente': parseInt(id_cliente),
            'id_tratamento': parseInt(id_tratamento),
        });
        return response.json({ agenda });
    },

    async update(request, response) {
        
        const { id } = request.params;
        const { dt_agendamento, hr_de, hr_ate, id_cliente, id_tratamento } = request.body;
        
        const agendamentos = await connection('agendamentos')
                        .join('clientes', 'agendamentos.id_cliente', '=', 'clientes.id')
                        .join('tratamentos', 'agendamentos.id_tratamento', '=', 'tratamentos.id_tratamento')
                        .select([
                          'agendamentos.*',
                          'clientes.name',
                          'tratamentos.nm_tratamento'
                      ])
                      .where('dt_agendamento', addSlashes(dt_agendamento))
                      .where('agendamentos.id', '<>', parseInt(id))
                      .orderBy('hr_de');
                      
        const filter = agendamentos.filter(trat => (
                                            (trat.hr_de < hr_de && trat.hr_ate > hr_de) 
                                            || (trat.hr_de < hr_ate && trat.hr_ate > hr_ate)
                                            || (trat.hr_de >= hr_de && trat.hr_ate <= hr_ate)
                                            ));
        
        if (filter.length > 0 ) {
            response.status(401);
            return response.json({'msg': 'Horário já utilizado para ' + filter[0].name })
        }
        
        await connection('agendamentos').update({
            'dt_agendamento': addSlashes(dt_agendamento),
            'hr_de': addSlashes(hr_de),
            'hr_ate': addSlashes(hr_ate),
            'id_cliente': parseInt(id_cliente),
            'id_tratamento': parseInt(id_tratamento),
        }).where('id', parseInt(id));
    
        return response.json({ id });
    },

    async delete(request, response) {

        const { id } = request.params;

        const agendamento = await connection('agendamentos')
                        .delete().where('id', parseInt(id));
        return response.json(agendamento);
    },

    async status(request, response) {

        const { id } = request.params;
        const { status } = request.body;

        const agendamento = await connection('agendamentos')
                            .update({
                                'status': addSlashes(status)}
                            ).where('id', parseInt(id));
        return response.json(agendamento);
    },

    async next(request, response) {

        const { dt_agendamento, limit } = request.query;
        const agendamentos = await connection('agendamentos')
                        .join('clientes', 'agendamentos.id_cliente', '=', 'clientes.id')
                        .join('tratamentos', 'agendamentos.id_tratamento', '=', 'tratamentos.id_tratamento')
                        .select([
                          'agendamentos.*',
                          'clientes.name',
                          'tratamentos.nm_tratamento'
                      ])
                      .where('dt_agendamento', '>=', dt_agendamento)
                      .orderBy(['dt_agendamento', 'hr_de'])
                      .limit(limit);
        return response.json(agendamentos);
    },
}