const express = require('express');
const routes  = require('./routes');
const cors    = require('cors'); 
const { errors } = require('celebrate');
const app = express();

app.use(cors());
/* Informar para o express que utilizaremos o json na requisição. Importante que venha antes das rotas. */
app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET = Busca
 * POST = Envio/ criação
 * PUT = Alteração
 * DELETE = Deletar
 */

/**
 * Tipos de parametros:
 * 
 * Query Params: Parametros enviados na rota (nomeados) após o simbolo de "interrogação"(?), para filtros e paginação;
 * Route Params: Parametros utilizados para identificar recursos (depoiis da barra users/:id -> id do usuário)
 * Request Body: Corpo da requisição, informações do usuário
 */

 /**
  * Driver: SELECT * FROM table
  * Query Builder: table('users').select('*').where('campos') Utilizado -> knexjs.org
  */
app.use(routes);
app.use(errors());

app.listen(3001);