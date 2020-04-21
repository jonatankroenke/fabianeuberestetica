const connection     = require('../database/connection');
const { addSlashes } = require('slashes');

module.exports = {

    async index(request, response) {

        const clientes = await connection('clientes')
                        .select('*').orderBy('name');

        return response.json(clientes);
    },

    async edit(request, response) {

        const { id } = request.params;

        const clientes = await connection('clientes')
                        .select('*')
                        .where('id', id).first();
        response.status(clientes === undefined ? 404 : 200);
        return response.json(clientes);
    },

    async create(request, response) {
        
        const { name, email, whatsapp  } = request.body;
        
        const [id] = await connection('clientes').insert({
            'name': addSlashes(name),
            'email': addSlashes(email),
            'whatsapp': addSlashes(whatsapp)
        });
        return response.json({ id });
    },

    async update(request, response) {
        
        const { id } = request.params;
        const { name, email, whatsapp  } = request.body;

        await connection('clientes').update({
            'name': addSlashes(name),
            'email': addSlashes(email),
            'whatsapp': addSlashes(whatsapp)
        }).where('id', parseInt(id));
    
        return response.json({ name });
    },
}