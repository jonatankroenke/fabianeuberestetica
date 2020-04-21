import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import Header      from '../Header';
import api         from '../../services/api';
import {getToken}  from '../../services/auth';
import EditIcon    from 'mdi-react/EditIcon';
import './styles.css';

export default function ClientesList(props) {
    
    const queryParams             = queryString.parse(props.location.search);
    const [clientes, setClientes] = useState([]);
    const [rows, setRows]         = useState([]);
    const [name, setName]         = useState((queryParams.name) ? queryParams.name : '');
    const [whatsapp, setWhatsapp] = useState((queryParams.whatsapp) ? queryParams.whatsapp : '');
    const history                 = useHistory();

    useEffect(() => {

        api.get('clientes').then(response => {
            setClientes(response.data);
            setRows(response.data.filter(cliente => cliente.name.toLowerCase().includes(name.toLowerCase()) && cliente.whatsapp.includes(whatsapp)));
        });

    }, []);

    async function handleFilter(e) {
        e.preventDefault();
        
        history.location.search = `?name=${escape(name)}&whatsapp=${escape(whatsapp)}`;
        history.replace(`/clientes${history.location.search}`);

        setRows(clientes.filter(cliente => cliente.name.toLowerCase().includes(name.toLowerCase()) && cliente.whatsapp.includes(whatsapp)));
    }

    return (
        <Header>
            <div className="general-container">
                <div className="content">
                    <div className="filter-content">
                        <h1>Lista de Clientes</h1>
                        <p>Lista de todos os seus clientes cadastrados. Utilize o filtro para buscar a informação desejada.</p>
                        <Link to="/clientes/new" className="button new-page">Novo</Link>
                        <form onSubmit={handleFilter}>
                            <input 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder="Nome"
                            />
                            <input 
                                value={whatsapp} 
                                onChange={e => setWhatsapp(e.target.value)}
                                placeholder="Whatsapp"
                            />
                            <button type="submit" className="button">Buscar</button>
                        </form>
                    </div>
                    <div className="list-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Whatsapp</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            { rows.length > 0 ? rows.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>
                                        <p>{cliente.name}</p>
                                    </td>
                                    <td>
                                        <p>{cliente.email}</p>
                                    </td>
                                    <td>
                                        <p>{cliente.whatsapp}</p>
                                    </td>
                                    <td>
                                        <Link to={`/clientes/${cliente.id}`} color="#666">
                                            <EditIcon/>
                                        </Link>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="4">Nenhum cliente encontrado</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Header>
    )
}