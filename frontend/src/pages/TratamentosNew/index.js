import React, { useState, useEffect } from 'react';
import { useHistory, useParams }      from 'react-router-dom';
import api                            from '../../services/api';
import Header                         from '../Header';
import './styles.css';

export default function TratamentosNew() {

    const [nm_tratamento, setNmTratamento] = useState('');
    const [ds_tratamento, setDsTratamento] = useState('');
    const [vl_tratamento, setVlTratamento] = useState('');
    const [msg, setMsg]                    = useState('');
    const [classMsg, setClassMsg]          = useState('');
    const history                          = useHistory();
    const [loading, setLoading]            = useState(false);
    const id                               = parseInt(useParams().id);
    const [title, setTitle]                = useState((id > 0) ? 'Alterar' : 'Cadastrar');

    const validation = {
        nm_tratamento: "Campo Nome é obrigatório",
        ds_tratamento: "Campo Descrição é obrigatório",
        vl_tratamento: "Campo Valor é obrigatório",
    };

    useEffect(() => {

        if (id > 0) {

            api.get(`tratamentos/${id}`).then(response => {
    
                setNmTratamento(response.data.nm_tratamento);
                setDsTratamento(response.data.ds_tratamento);
                setVlTratamento(response.data.vl_tratamento);
    
            }).catch(error => {
                history.push('/tratamentos/new');
            });
        }
    }, []);

    async function handleTratamento(e) {
        e.preventDefault();

        const data = {
            nm_tratamento,
            ds_tratamento,
            vl_tratamento
        }

        setLoading(true);

        if (id > 0) {

            await api.put(`tratamentos/${id}`, data).then(response => {
            
                setMsg('Cadastro alterado com sucesso. Aguarde...');
                setClassMsg('success_msg');
                
                setTimeout(() => {
                    history.push('/tratamentos');
                }, 1500);
                
            }).catch(error => {
    
                let msg_error = (error.response.status === 400) ? 
                    validation[error.response.data.validation.keys[0]] :
                    'Erro ao realizar o cadastro, tente novamente.'
                    
                    setMsg(msg_error);
                    setClassMsg('erro_msg');    
            });
        } else {

            await api.post('tratamentos', data).then(response => { 
    
                setMsg('Cadastro realizado com sucesso.');
                setClassMsg('success_msg');
                clearForm();
    
                setTimeout(() => {
                    history.push('/tratamentos');
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
        setNmTratamento('');
        setDsTratamento('');
        setVlTratamento('');
    }

    return (
        <Header loading={loading}>
            <div className="general-container">
                <div className="content">
                    <h1>{title} Tratamentos</h1>
                    <p>Preencha com todos os dados do tratamento, pois informação nunca é demais né?</p>
                    <form onSubmit={handleTratamento}>
                        <input 
                            value={nm_tratamento} 
                            onChange={e => setNmTratamento(e.target.value)} 
                            placeholder="Nome"
                        />
                        <textarea 
                            value={ds_tratamento} 
                            onChange={e => setDsTratamento(e.target.value)} 
                            placeholder="Descrição"
                        ></textarea>
                        <input 
                            value={vl_tratamento} 
                            onChange={e => setVlTratamento(e.target.value)} 
                            placeholder="Valor"
                            type="number"
                        />    
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