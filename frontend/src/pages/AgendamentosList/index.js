import React, { useState, useEffect }  from 'react';
import { Link, useHistory }            from 'react-router-dom';
import api                             from '../../services/api'
import {getToken}                      from '../../services/auth'
import Header                          from '../Header';
import Calendar                        from 'react-calendar';
import EditIcon                        from 'mdi-react/EditIcon';
import queryString                     from 'query-string';
import 'react-calendar/dist/Calendar.css';
import './styles.css';

export default function AgendamentosList(props) {

    const [loading, setLoading]           = useState(false);
    const [dt_filter, setDtFilter]        = useState(new Date());
    const [agendamentos, setAgendamentos] = useState([]);
    const queryParams                     = queryString.parse(props.location.search);
    const history                         = useHistory();

    useEffect(() => {

        let data_format = Intl.DateTimeFormat('pt-BR').format(dt_filter);
        let data_usage  = data_format.split('/').reverse().join('-');
        
        if (queryParams.dt_agendamento) {
            let arr_data_usage = queryParams.dt_agendamento.split('-');
            data_usage = queryParams.dt_agendamento;
            setDtFilter(new Date(parseInt(arr_data_usage[0]), parseInt(arr_data_usage[1]) - 1, parseInt(arr_data_usage[2])));
        }

        api.get(`agendamentos?dt_agendamento=${data_usage}`).then(response => {
            setAgendamentos(response.data);
        });
    }, []);

    async function changeDate(data) {

        setLoading(true);
        let data_format = Intl.DateTimeFormat('pt-BR').format(data);

        await api.get(`agendamentos?dt_agendamento=${data_format.split('/').reverse().join('-')}`).then(response => {
            
            history.location.search = `?dt_agendamento=${data_format.split('/').reverse().join('-')}`;
            history.replace(`/agendamentos${history.location.search}`);
            setAgendamentos(response.data);

        }).catch(error => {
            setAgendamentos([]);
        });
        setDtFilter(data);
        setLoading(false);
    }
    
    return (
        <Header loading={loading}>
            <div className="general-container">
                <div className="content">
                    <h1>Seus Agendamentos do dia {Intl.DateTimeFormat('pt-BR').format(dt_filter)}</h1>
                    <p>Organização é a melhor coisa que existe né? Por isso estamos te ajudando!</p>
                    <Link to={`/agendamentos/new/${Intl.DateTimeFormat('pt-BR').format(dt_filter).split('/').join('-')}`} className="button new-page">Novo</Link>
                    <form className="formListAgendamentos">
                        <Calendar 
                          value={dt_filter}
                          onChange={(v, e) => changeDate(v)}
                        />
                        <ul className="listAgendamentos">
                            {
                                agendamentos.map(agenda => (
                                    <li key={agenda.id} className={agenda.status === 'A' ? 'atendido' : ''}>
                                        <p>
                                            <strong>{agenda.hr_de} até {agenda.hr_ate} - {agenda.name}</strong>
                                            {agenda.nm_tratamento}
                                        </p>
                                        <div><Link to={`agendamentos/${agenda.id}`}><EditIcon/></Link></div>
                                    </li>
                                ))
                            } 
                            {
                                (agendamentos.length === 0) ? <li style={{justifyContent: 'center'}}>Nenhum agendamento.</li> : ''
                            }
                        </ul>
                    </form>
                </div>
            </div>
        </Header>
    );
}