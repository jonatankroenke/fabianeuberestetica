const crypto         = require('crypto');
const connection     = require('../database/connection');
const { addSlashes } = require('slashes');

module.exports = {

    async index(request, response) {

        const usuarios = await connection('usuarios').select('*');

        return response.json(usuarios);
    },

    async show(request, response) {
        const { id } = request.params;

        const usuario = await connection('usuarios').where('id', addSlashes(id)).select(['id', 'email', 'name']).first();

        if (!usuario) {
            return response.status(400).json({
                error: "Usuário não encontrado."
            })
        }
        return response.json(usuario);
    }, 

    async create(request, response) {

        /* Obter Body da requisição */
        const { name, email, senha } = request.body;

        const ret = await connection('usuarios').insert({
            'name': addSlashes(name),
            'email': addSlashes(email),
            'senha': crypto.createHash('md5').update(addSlashes(senha)).digest('hex'),
        });
        return response.json({ret});
    },

    async update(request, response) {
        
        const { id } = request.params;

        /* Obter Body da requisição */
        const { name, email, senha } = request.body;

        const data = {
            'name': addSlashes(name),
            'email': addSlashes(email),
        }

        if (senha !== undefined) {
            data.senha = crypto.createHash('md5').update(addSlashes(senha)).digest('hex');
        }
        await connection('usuarios').update(data).where('id', parseInt(id));
        return response.json({name});
    },
};