import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';

import LogoImg from '../../assets/logo.png';
import api from '../../services/api';
import { login } from "../../services/auth";

export default function Logon() {
    
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg]           = useState('');
    const [classMsg, setClassMsg] = useState('');
    const history                 = useHistory();
    
    async function handleLogon(e) {
        e.preventDefault();
        
        const data = { email, senha: password };

        try {
            const response = await api.post('session', data);
            
            login(response.data.id, response.data.name);

            history.push('/home');

        } catch (error) {
            setMsg('Erro ao realizar o Login com dados, tente novamente.');
            setClassMsg('erro_msg');
        } 
    }

    return (
        <div className="gradient-login">
            <div className="logon-container">
                <section>
                    <img src={LogoImg} alt="Fabiane Uber Estética"/>
                </section>
                <section className="form">
                    <form onSubmit={handleLogon}>
                        <h1>Faça seu Login</h1>
                        <input 
                            value={email} 
                            onChange={e => setEmail(e.target.value) } 
                            placeholder="Insira seu E-mail" 
                        /> 
                        <input 
                            value={password} 
                            onChange={e => setPassword(e.target.value) } 
                            placeholder="Insira sua Senha" 
                            type="password"
                        /> 
                        <button className="button" type="submit">Entrar</button>
                        <p className={classMsg}>{msg}</p>
                    </form>
                </section>
            </div>
        </div>
    );
}