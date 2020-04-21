import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import queryString  from 'query-string';
import Header       from '../Header';
import api          from '../../services/api';
import EditIcon     from 'mdi-react/EditIcon';
import MoneyOffIcon from 'mdi-react/MoneyOffIcon';
import PaymentIcon  from 'mdi-react/PaymentIcon';
import UploadIcon   from 'mdi-react/UploadIcon';
import './styles.css';

export default function ClientesList(props) {
    
    const months                           = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const dt                               = new Date();
    const queryParams                      = queryString.parse(props.location.search);
    const [rows, setRows]                  = useState([]);
    const [vl_entrada, setVlEntrada]       = useState(0);
    const [vl_saida, setVlSaida]           = useState(0);
    const [vl_saldo, setVlSaldo]           = useState(0);
    const [dt_inicio, setDtInicio]         = useState((queryParams.dt_inicio) ? queryParams.dt_inicio : dt.getFullYear()+'-'+months[dt.getMonth()]+'-01');
    const [dt_fim, setDtFim]               = useState((queryParams.dt_fim) ? queryParams.dt_fim : dt.getFullYear()+'-'+months[dt.getMonth()]+'-'+dt.getDate());
    const history                          = useHistory();
    
    function getFilter() {

        history.location.search = `?dt_inicio=${escape(dt_inicio)}&dt_fim=${escape(dt_fim)}`;
        history.replace(`/lancamentos${history.location.search}`);

        api.get('lancamentos'+history.location.search).then(response => {
            setRows(response.data);
            
            let vl_e = 0;
            let vl_s = 0;
            response.data.map(lancamento => {
                if (lancamento.tp_destino === 'E') {
                    vl_e += parseFloat(lancamento.vl_lancamento);
                } else if (lancamento.tp_destino === 'S') {
                    vl_s += parseFloat(lancamento.vl_lancamento);
                }
            });
            setVlEntrada(vl_e);
            setVlSaida(vl_s);
            setVlSaldo(vl_e - vl_s);
        });
    }

    useEffect(() => {
        getFilter();
    }, []);

    async function handleFilter(e) {
        e.preventDefault();
        getFilter();
    }

    return (
        <Header>
            <div className="general-container">
                <div className="content">
                    <div className="filter-content">
                        <h1>Lista de Lançamentos</h1>
                        <p>Gerenciar de forma organizada leva você a outro patamar!</p>
                        <Link to="/lancamentos/new" className="button new-page">Novo</Link>
                        <form onSubmit={handleFilter}>
                            <input 
                                value={dt_inicio} 
                                onChange={e => setDtInicio(e.target.value)}
                                placeholder="Data Inicial"
                                type="date"
                            />
                            <input 
                                value={dt_fim} 
                                onChange={e => setDtFim(e.target.value)}
                                placeholder="Data Final"
                                type="date"
                            />
                            <button type="submit" className="button">Buscar</button>
                        </form>
                    </div>
                    <div className="contentTotais">
                      <div className="entrada">
                        <p>Entradas:</p>
                        <PaymentIcon/>
                        <h2>{ Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(vl_entrada)}</h2>
                      </div>
                      <div className="saida">
                        <p>Saídas:</p>
                        <MoneyOffIcon/>
                        <h2>{ Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(vl_saida) }</h2>
                      </div>
                      <div className="saldo">
                        <p>Saldo:</p>
                        <UploadIcon/>
                        <h2>{ Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format((vl_entrada - vl_saida)) }</h2>
                      </div>
                    </div>
                    <div className="list-content">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            { rows.length > 0 ? rows.map(lancamento => (
                                <tr key={lancamento.id} className={(lancamento.tp_destino === 'E') ? 'entrada' : 'saida'}>
                                    <td>
                                        {
                                            (lancamento.id_agendamento !== null) ?
                                                <span className="badgeLancamento">Agendamento</span>
                                            :
                                                <span className="badgeLancamento">Manual</span>
                                        }
                                    </td>
                                    <td>
                                        <p>{lancamento.ds_titulo}</p>
                                    </td>
                                    <td>
                                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(lancamento.vl_lancamento)}</p>
                                    </td>
                                    <td>
                                        <p>{lancamento.dt_lancamento.split('-').reverse().join('/')}</p>
                                    </td>
                                    <td>
                                        <Link to={`/lancamentos/${lancamento.id}`} color="#666">
                                            <EditIcon/>
                                        </Link>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="4">Nenhum lançamento encontrado</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Header>
    )
}