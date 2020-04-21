import React, { useState, useEffect } from 'react';
import { useHistory, useParams }      from 'react-router-dom';
import api                            from '../../services/api';
import Header                         from '../Header';
import queryString                    from 'query-string';
import './styles.css';

export default function TratamentosNew() {

    const date                             = new Date();
    const data_format                      = Intl.DateTimeFormat('pt-BR').format(date);
    const [ds_titulo, setDsTitulo]         = useState('');
    const [dt_lancamento, setDtLancamento] = useState(data_format.split('/').reverse().join('-'));
    const [vl_lancamento, setVlLancamento] = useState('');
    const [tp_destino, setTpDestino]       = useState('');
    const [tp_forma_pagamento, setTpFormaPagamento] = useState('');
    const [ds_obs, setDsObs]               = useState('');
    const [msg, setMsg]                    = useState('');
    const [classMsg, setClassMsg]          = useState('');
    const history                          = useHistory();
    const [loading, setLoading]            = useState(false);
    const id                               = parseInt(useParams().id);
    const { id_agendamento }                = queryString.parse(history.location.search);
    const [title, setTitle]                = useState((id > 0) ? 'Alterar' : 'Cadastrar');

    const validation = {
        ds_titulo:          "Campo Título é obrigatório",
        dt_lancamento:      "Campo Data de Lançamento é obrigatório",
        vl_lancamento:      "Campo Valor é obrigatório",
        tp_destino:         "Campo Destino é obrigatório",
        tp_forma_pagamento: "Campo Forma Pagamento é obrigatório",
    };

    useEffect(() => {

        if (id > 0) {

            api.get(`lancamentos/${id}`).then(response => {
    
              setDsTitulo(response.data.ds_titulo);
              setDtLancamento(response.data.dt_lancamento);
              setVlLancamento(response.data.vl_lancamento);
              setTpDestino(response.data.tp_destino);
              setTpFormaPagamento(response.data.tp_forma_pagamento);
              setDsObs(response.data.ds_obs === null ? '' : response.data.ds_obs);
    
            }).catch(error => {
                history.push('/lancamentos/new');
            });
        }
    }, []);

    async function handleLancamento(e) {
        e.preventDefault();

        const data = {
            ds_titulo,
            dt_lancamento,
            vl_lancamento,
            tp_destino,
            tp_forma_pagamento,
            ds_obs
        }

        setLoading(true);

        if ((id !== undefined) && (id > 0)) {

            await api.put(`lancamentos/${id}`, data).then(response => {
            
                setMsg('Cadastro alterado com sucesso. Aguarde...');
                setClassMsg('success_msg');
                
                setTimeout(() => {
                    history.push('/lancamentos');
                }, 1500);
                
            }).catch(error => {
    
                let msg_error = (error.response.status === 400) ? 
                    validation[error.response.data.validation.keys[0]] :
                    'Erro ao realizar a alteração, tente novamente.'
                    
                    setMsg(msg_error);
                    setClassMsg('erro_msg');    
            });
        } else {

            await api.post('lancamentos', data).then(response => { 
    
                setMsg('Cadastro realizado com sucesso.');
                setClassMsg('success_msg');
                clearForm();
    
                setTimeout(() => {
                    history.push('/lancamentos');
                }, 1500);
            })
            .catch(error => {
    
                let msg_error = (error.response.status === 400) ? 
                    validation[error.response.data.validation.keys[0]] :
                    'Erro ao realizar o cadastro, tente novamente.'
    
                setMsg(msg_error);
                setClassMsg('erro_msg');
            });
        }
        setLoading(false);
    }

    function clearForm() {
        setDsTitulo('');
        setDtLancamento('');
        setVlLancamento('');
        setTpDestino('');
        setTpFormaPagamento('');
        setDsObs('');
    }

    return (
        <Header loading={loading}>
            <div className="general-container">
                <div className="content">
                    <h1>{title} Lançamento</h1>
                    <p>Cadastre tudo, o máximo de informação aqui é fundamental para seu planejamento.</p>
                    {
                        (id_agendamento !== undefined) ?
                            <p className="success_msg">Lançamento do agendamento { id_agendamento }, confira e altere as informações conforme necessidade.</p>
                        : ''
                    }
                    <form onSubmit={handleLancamento}>
                        <input 
                            value={ds_titulo} 
                            onChange={e => setDsTitulo(e.target.value)} 
                            placeholder="Título"
                        />
                        <input 
                            value={dt_lancamento} 
                            onChange={e => setDtLancamento(e.target.value)} 
                            placeholder="Data"
                            type="date"
                        />
                        <input 
                            value={vl_lancamento} 
                            onChange={e => setVlLancamento(e.target.value)} 
                            placeholder="Valor"
                            type="number"
                        /> 
                        <select 
                            value={tp_destino} 
                            onChange={e => setTpDestino(e.target.value)}
                        >
                          <option value="">Selecione o Destino..</option>
                          <option value="E">Entrada</option>
                          <option value="S">Saída</option>
                        </select> 
                        <select 
                            value={tp_forma_pagamento} 
                            onChange={e => setTpFormaPagamento(e.target.value)}
                        >
                          <option value="">Selecione a Forma de Pagamento..</option>
                          <option value="AV">À Vista</option>
                          <option value="PR">Prazo</option>
                          <option value="BO">Boleto</option>
                        </select>    
                        <textarea 
                            value={ds_obs} 
                            onChange={e => setDsObs(e.target.value)} 
                            placeholder="Observação"
                        ></textarea>
                        <div className="content-buttons">
                            <button className="button cancel" type="button" onClick={ () => history.goBack()}>Voltar</button>
                            <button className="button" type="submit">{title}</button>
                        </div>
                        <p className={classMsg}>{msg}</p>
                    </form>
                </div>
            </div>
        </Header>
    );
} 