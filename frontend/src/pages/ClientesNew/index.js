import React, { useState, useEffect } from 'react';
import { useHistory, useParams }      from 'react-router-dom';
import MaskedInput                    from 'react-maskedinput'
import api                            from '../../services/api';
import Header                         from '../Header';
import './styles.css';

export default function ClientesNew() {

    const [name, setName]          = useState('');
    const [email, setEmail]        = useState('');
    const [whatsapp, setWhatsapp]  = useState('');
    const [msg, setMsg]            = useState('');
    const [classMsg, setClassMsg]  = useState('');
    const history                  = useHistory();
    const [loading, setLoading]    = useState(false);
    const id                       = parseInt(useParams().id);    
    const [title, setTitle]        = useState((id > 0) ? 'Alterar' : 'Cadastrar');

    const validation = {
        name:     "Campo Nome é obrigatório",
        email:    "Campo E-mail é obrigatório",
        whatsapp: "Campo Whatsapp é obrigatório",
    };

    useEffect(() => {
        if (id > 0) {
            api.get(`clientes/${id}`).then(response => {

                setName(response.data.name);
                setEmail(response.data.email);
                setWhatsapp(response.data.whatsapp);
    
            }).catch(error => {
                history.push('/clientes/new');
            });
        }
    }, []);

    async function handleCliente(e) {
        e.preventDefault();

        const data = {
            name,
            email,
            whatsapp: whatsapp.replace(/[^a-z0-9]/gi,'')
        }

        setLoading(true);

        if (id > 0) {

            await api.put(`clientes/${id}`, data).then(response => {
            
                setMsg('Cadastro alterado com sucesso. Aguarde...');
                setClassMsg('success_msg');
                
                setTimeout(() => {
                    history.push('/clientes');
                }, 1500);
                
            }).catch(error => {
    
                let msg_error = (error.response.status === 400) ? 
                    validation[error.response.data.validation.keys[0]] :
                    'Erro ao realizar a alteração, tente novamente.'
                    
                    setMsg(msg_error);
                    setClassMsg('erro_msg');    
            });
        } else {

            await api.post('clientes', data).then(response => { 
    
                setMsg('Cadastro realizado com sucesso.');
                setClassMsg('success_msg');
                clearForm();
    
                setTimeout(() => {
                    history.push('/clientes');
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
        setName('');
        setEmail('');
        setWhatsapp('');
    }

    return (
        <Header loading={loading}>
            <div className="general-container">
                <div className="content">
                    <h1>{title} Clientes</h1>
                    <p>Preencha com todos os dados do cliente, pois informação nunca é demais né?</p>
                    <form onSubmit={handleCliente}>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Nome"
                        />
                        <input 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            type="email"
                            placeholder="E-mail"
                        />
                        <MaskedInput 
                            value={whatsapp} 
                            onChange={e => setWhatsapp(e.target.value)} 
                            placeholder="Whatsapp"
                            mask="(11) 1 1111-1111" size="20"
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