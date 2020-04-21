import React, { useState, useEffect }  from 'react';
import { useHistory }                  from 'react-router-dom';
import api                             from '../../services/api';
import { getToken, login }             from '../../services/auth';
import Header                          from '../Header';
import './styles.css';

export default function Config() {

    const [name, setName]          = useState('');
    const [email, setEmail]        = useState('');
    const [senha, setSenha]        = useState('');
    const [msg, setMsg]            = useState('');
    const [classMsg, setClassMsg]  = useState('');
    const history                  = useHistory();
    const [loading, setLoading]    = useState(false);

    const validation = {
        name: "Campo Nome é obrigatório",
        email: "Campo E-mail é obrigatório",
    };

    const id = getToken()

    useEffect(() => {
        api.get(`usuarios/${id}`).then(response => {

            setName(response.data.name);
            setEmail(response.data.email);

        }).catch(error => {
            history.push('/home');
        });
    }, []);

    if (isNaN(id)) {
        history.push('/home');
    }

    async function handleUpdateConfig(e) {
        e.preventDefault();
        const data = {
            name,
            email,
        }

        if (senha !== '') {
            data.senha = senha;
        }

        setLoading(true);
        await api.put(`usuarios/${id}`, data).then(response => {
            
            setMsg('Cadastro alterado com sucesso.');
            login(id, data.name);
            setClassMsg('success_msg');
            
        }).catch(error => {

            let msg_error = (error.response.status === 400) ? 
                validation[error.response.data.validation.keys[0]] :
                'Erro ao realizar o cadastro, tente novamente.'
                
                setMsg(msg_error);
                setClassMsg('erro_msg');    
        });
        setLoading(false);
    }
    
    return (
        <Header loading={loading}>
            <div className="general-container">
                <div className="content">
                    <h1>Alteração das suas Configurações</h1>
                    <p>Alterações normalmente são necessárias, mas não se esqueça de lembrar seus dados de acesso ao sistema, hein?</p>
                    <form onSubmit={handleUpdateConfig}>
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
                        <input 
                            value={senha} 
                            onChange={e => setSenha(e.target.value)} 
                            placeholder="Nova Senha"
                            type="password"
                        />    
                        <div className="content-buttons">
                            <button className="button cancel" type="button" onClick={ () => history.goBack()}>Voltar</button>
                            <button className="button" type="submit">Alterar</button>
                        </div>
                        <p className={classMsg}>{msg}</p>
                    </form>
                </div>
            </div>
        </Header>
    );
}