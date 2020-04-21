import React, {useEffect, useState}    from 'react';
import { Link, useHistory }            from 'react-router-dom';
import api                             from '../../services/api'
import Header                          from '../Header';
import EditIcon                        from 'mdi-react/EditIcon';
import MoneyOffIcon                    from 'mdi-react/MoneyOffIcon';
import PaymentIcon                     from 'mdi-react/PaymentIcon';
import UploadIcon                      from 'mdi-react/UploadIcon';
import { getUsername }                 from "../../services/auth";
import './styles.css';

export default function Home() {

    const months                           = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const dt                               = new Date();
    const data_format                      = Intl.DateTimeFormat('pt-BR').format(dt);
    const userName                         = getUsername();
    const [agendamentos, setAgendamentos]  = useState([]);
    const [vl_entrada, setVlEntrada]       = useState(0);
    const [vl_saida, setVlSaida]           = useState(0);
    const [vl_saldo, setVlSaldo]           = useState(0);
    const [dt_inicio, setDtInicio]         = useState(dt.getFullYear()+'-'+months[dt.getMonth()]+'-01');
    const [dt_fim, setDtFim]               = useState(data_format.split('/').reverse().join('-'));

    async function getLancamentosMes() {

         api.get(`lancamentos?dt_inicio=${escape(dt_inicio)}&dt_fim=${escape(dt_fim)}`).then(response => {
            
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

        let data_format = Intl.DateTimeFormat('pt-BR').format(new Date());
        let data_usage  = data_format.split('/').reverse().join('-');

        api.get(`agendamentos/next?dt_agendamento=${data_usage}&limit=5`).then(response => {
            setAgendamentos(response.data);
        });

        getLancamentosMes();

    }, []);

    return (
        <Header>
            <div className="home-container">
                <div className="content">
                    <section>
                        <div>
                            <h1>Este Mês</h1>
                            <div className="contentTotais home">
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
                        </div>
                        <div>
                            <h1>Próximos Atendimentos</h1>
                            <ul>
                                {
                                    agendamentos.map(agenda => (
                                        <li key={agenda.id} className={agenda.status === 'A' ? 'atendido' : ''}>
                                            <p>
                                                <strong>
                                                    {agenda.dt_agendamento.split('-').reverse().join('/')+' '}  
                                                    das {agenda.hr_de} até {agenda.hr_ate}
                                                </strong>
                                                <br/>
                                                <strong>{agenda.name}</strong>   
                                                {agenda.nm_tratamento}
                                            </p>
                                            <span><Link to={`agendamentos/${agenda.id}`}><EditIcon/></Link></span>
                                        </li>
                                    ))
                                } 
                                {
                                    (agendamentos.length === 0) ? <li style={{justifyContent: 'center'}}>Nenhum agendamento.</li> : ''
                                }
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </Header>
    )
}