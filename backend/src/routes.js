const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const routes  = express.Router();

const ongController      = require('./controllers/OngController');
const incidentController = require('./controllers/IncidentController');
const profileController  = require('./controllers/ProfileController');
const sessionController  = require('./controllers/SessionController');
const userController     = require('./controllers/UserController');
const clienteController  = require('./controllers/ClienteController');
const tratamentosController  = require('./controllers/TratamentosController');
const agendamentosController = require('./controllers/AgendamentoController');
const lancamentosController = require('./controllers/LancamentoController');

routes.get('/ongs', ongController.index);
routes.post('/ongs', celebrate({

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    }),

}), ongController.create);

routes.get('/incidents', celebrate({

    [Segments.QUERY]: Joi.object().keys({
       page: Joi.number(), 
    }),

}), incidentController.index);

routes.post('/incidents', celebrate({

    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required(),
    }),
    
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), incidentController.create);

routes.delete('/incidents/:id', celebrate({

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),

}), incidentController.delete);

routes.get('/profile', celebrate({

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), profileController.index);

routes.post('/session', celebrate({

    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required(),
        senha: Joi.string().required(),
    }),

}), sessionController.create);

routes.get('/usuarios', userController.index);
routes.get('/usuarios/:id', userController.show);
routes.post('/usuarios', celebrate({

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(4),
    }),

}), userController.create);

routes.put('/usuarios/:id', celebrate({

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        senha: Joi.string(),
    }),

}), userController.update);

/* Transações de clientes */
routes.post('/clientes', celebrate({

    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
    }),
    
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), clienteController.create);

routes.put('/clientes/:id', celebrate({
    
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),
    
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
    }),
    
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), clienteController.update);
routes.get('/clientes', clienteController.index);
routes.get('/clientes/:id', clienteController.edit);

/* Transações de tratamentos */
routes.post('/tratamentos', celebrate({
    
    [Segments.BODY]: Joi.object().keys({
        nm_tratamento: Joi.string().required(),
        ds_tratamento: Joi.string().required(),
        vl_tratamento: Joi.number().required(),
    }),
    
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown()

}), tratamentosController.create);

routes.put('/tratamentos/:id', celebrate({
    
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),
    
    [Segments.BODY]: Joi.object().keys({
        nm_tratamento: Joi.string().required(),
        ds_tratamento: Joi.string().required(),
        vl_tratamento: Joi.number().required(),
    }),
    
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), tratamentosController.update);
routes.get('/tratamentos', tratamentosController.index);
routes.get('/tratamentos/:id', tratamentosController.edit);

routes.get('/agendamentos', agendamentosController.index);
routes.post('/agendamentos', celebrate({

    [Segments.BODY]: Joi.object().keys({
        dt_agendamento: Joi.string().required(),
        hr_de: Joi.string().required(),
        hr_ate: Joi.string().required(),
        id_cliente: Joi.number().required().min(1),
        id_tratamento: Joi.number().required().min(1)
    }),

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), agendamentosController.create);
routes.put('/agendamentos/:id', celebrate({

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),

    [Segments.BODY]: Joi.object().keys({
        dt_agendamento: Joi.string().required(),
        hr_de: Joi.string().required(),
        hr_ate: Joi.string().required(),
        id_cliente: Joi.number().required(),
        id_tratamento: Joi.number().required()
    }),

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), agendamentosController.update);
routes.put('/agendamentos/finalizar/:id', celebrate({

    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),

    [Segments.BODY]: Joi.object().keys({
        status: Joi.string().required().length(1),
    }),

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), agendamentosController.status);
routes.get('/agendamentos/next/', agendamentosController.next);
routes.get('/agendamentos/:id', agendamentosController.edit);
routes.delete('/agendamentos/:id', agendamentosController.delete);

routes.post('/lancamento/agendamento', celebrate({

    [Segments.BODY]: Joi.object().keys({
        id_agendamento: Joi.number().required(),
    }),

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), lancamentosController.createLancamentoAgendamento);

routes.post('/lancamentos', celebrate({

    [Segments.BODY]: Joi.object().keys({
        ds_titulo: Joi.string().required(),
        dt_lancamento: Joi.string().required(),
        vl_lancamento: Joi.string().required(),
        tp_destino: Joi.string().required().length(1),
        tp_forma_pagamento: Joi.string().required().length(2),
        ds_obs: Joi.string()
    }),

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), lancamentosController.create);
routes.put('/lancamentos/:id', celebrate({
    
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    }),

    [Segments.BODY]: Joi.object().keys({
        ds_titulo: Joi.string().required(),
        dt_lancamento: Joi.string().required(),
        vl_lancamento: Joi.string().required(),
        tp_destino: Joi.string().required().length(1),
        tp_forma_pagamento: Joi.string().required().length(2),
        ds_obs: Joi.string()
    }),

    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),

}), lancamentosController.update);
routes.get('/lancamentos', lancamentosController.index);
routes.get('/lancamentos/:id', lancamentosController.edit);

module.exports = routes;