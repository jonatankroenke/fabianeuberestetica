const connection     = require('../database/connection');
const crypto         = require('crypto');
const { addSlashes } = require('slashes');

module.exports = {
    async create(request, response) {
        const { email, senha } = request.body;

        const usuario = await connection('usuarios').where('email', addSlashes(email)).where('senha', crypto.createHash('md5').update(addSlashes(senha)).digest('hex')).select(['id', 'name']).first();

        if (!usuario) {
            return response.status(400).json({
                error: "Usuário não encontrado para este E-mail e Senha"
            })
        }
        return response.json(usuario);
    }
}