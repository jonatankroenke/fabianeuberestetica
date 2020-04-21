import React, { useState, useEffect } from 'react';
import { Link, useHistory }           from 'react-router-dom';
import queryString                    from 'query-string';
import Header                         from '../Header';
import api                            from '../../services/api';
import {getToken}                     from '../../services/auth';
import EditIcon                       from 'mdi-react/EditIcon';
import './styles.css';

export default function TratamentosList(props) {
    const queryParams                      = queryString.parse(props.location.search);
    const [nm_tratamento, setNmTratamento] = useState((queryParams.nm_tratamento) ? queryParams.nm_tratamento : '');
    const [rows, setRows]                  = useState([]);
    const [tratamentos, setTratamentos]    = useState([]);
    const history                          = useHistory();

    useEffect(() => {

        api.get('tratamentos').then(response => {
            setTratamentos(response.data);
            setRows(response.data.filter(tratamento => tratamento.nm_tratamento.toLowerCase().includes(nm_tratamento.toLowerCase())));
        });

    }, []);

    function handleFilter (e) {
        e.preventDefault();
        history.replace(`/tratamentos?nm_tratamento=${escape(nm_tratamento)}`);
        setRows(tratamentos.filter(tratamento => tratamento.nm_tratamento.toLowerCase().includes(nm_tratamento.toLowerCase())));
    }

    return (
        <Header>
            <div className="general-container">
                <div className="content">
                    <div className="filter-content">
                        <h1>Lista de Tratamentos</h1>
                        <p>Lista de todos os seus tratamentos com nome e valor conforme cadastro realizado.</p>
                        <Link to="/tratamentos/new" className="button new-page">Novo</Link>
                        <form onSubmit={handleFilter}>
                            <input 
                                value={nm_tratamento} 
                                onChange={e => setNmTratamento(e.target.value)} 
                                placeholder="Nome"
                            />
                            <button type="submit" className="button">Buscar</button>
                        </form>
                    </div>
                    <div className="list-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Valor</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            { rows.length > 0 ? rows.map(tratamento => (
                                <tr key={tratamento.id_tratamento}>
                                    <td>
                                        <p>{tratamento.nm_tratamento}</p>
                                    </td>
                                    <td>
                                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(tratamento.vl_tratamento)}</p>
                                    </td>
                                    <td>
                                        <Link to={`/tratamentos/${tratamento.id_tratamento}`} color="#666">
                                            <EditIcon/>
                                        </Link>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="4">Nenhum tratamento encontrado</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Header>
    )
}