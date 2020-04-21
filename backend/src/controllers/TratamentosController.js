const connection     = require('../database/connection');
const { addSlashes } = require('slashes');

module.exports = {

    async index(request, response) {

        const tratamentos = await connection('tratamentos').select('*').orderBy('nm_tratamento');

        return response.json(tratamentos);
    },

    async edit(request, response) {

        const { id } = request.params;

        const tratamento = await connection('tratamentos')
                        .select('*')
                        .where('id_tratamento', id).first();

        response.status(tratamento === undefined ? 404 : 200);
        return response.json(tratamento);
    },

    async create(request, response) {
        
        const { nm_tratamento, ds_tratamento, vl_tratamento  } = request.body;
        
        const [id_tratamento] = await connection('tratamentos').insert({
            'nm_tratamento': addSlashes(nm_tratamento),
            'ds_tratamento': addSlashes(ds_tratamento),
            'vl_tratamento': parseFloat(vl_tratamento)
        });
        return response.json({ id_tratamento });
    },

    async update(request, response) {
        
        const { id } = request.params;
        const { nm_tratamento, ds_tratamento, vl_tratamento  } = request.body;

        await connection('tratamentos').update({
            'nm_tratamento': addSlashes(nm_tratamento),
            'ds_tratamento': addSlashes(ds_tratamento),
            'vl_tratamento': parseFloat(vl_tratamento)
        }).where('id_tratamento', parseInt(id));
    
        return response.json({ nm_tratamento });
    },
}