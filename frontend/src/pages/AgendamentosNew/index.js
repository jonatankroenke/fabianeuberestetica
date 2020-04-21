import React, { useState, useEffect } from 'react';
import { useHistory, useParams }      from 'react-router-dom';
import api                            from '../../services/api';
import Header                         from '../Header';
import './styles.css';

export default function AgendamentosNew(props) {

    const [clientes, setClientes]            = useState([]);
    const [id_cliente, setIdCliente]         = useState(0);
    const [tratamentos, setTratamentos]      = useState([]);
    const [id_tratamento, setIdTratamento]   = useState(0);
    const [dt_agendamento, setDtAgendamento] = useState('');
    const [hr_de, setHrDe]                   = useState('00:00');
    const [hr_ate, setHrAte]                 = useState('00:00');
    const [msg, setMsg]                      = useState('');
    const [classMsg, setClassMsg]            = useState('');
    const [status, setStatus]                = useState('');
    const history                            = useHistory();
    const [loading, setLoading]              = useState(false);
    const params                             = useParams();
    const id                                 = parseInt(params.id);
    const [title, setTitle]                  = useState((id > 0) ? 'Alterar' : 'Cadastrar');

    useEffect(() => {

      if (id > 0) {
        api.get(`agendamentos/${id}`).then(response => {

          setIdCliente(response.data.id_cliente);
          setIdTratamento(response.data.id_tratamento);
          setHrDe(response.data.hr_de);
          setHrAte(response.data.hr_ate);
          setDtAgendamento(response.data.dt_agendamento);
          setStatus(response.data.status);
  
        }).catch(error => {
          history.push('/agendamentos/new');
        });
      }

      api.get(`clientes`).then(response => {
        setClientes(response.data)
      });

      api.get(`tratamentos`).then(response => {
        setTratamentos(response.data)
      });

    }, []);

    const validation = {
        id_cliente:    "Selecione o cliente",
        id_tratamento: "Selecione o tratamento",
        hr_de:         "Informe o horário de inicio",
        hr_ate:        "Informe o horário de fim",
    };

    async function handleAgendamento(e) {
        e.preventDefault();

        const data = {
            dt_agendamento: (params.data !== undefined) ? params.data.split('-').reverse().join('-') : dt_agendamento,
            hr_de,
            hr_ate,
            id_cliente,
            id_tratamento,
        }

        if (hr_ate <= hr_de) {
          setMsg('Hora final deve ser maior que a hora inicial.');
          setClassMsg('erro_msg');
          return;
        }

        setLoading(true);

        if (id > 0) {

          await api.put(`agendamentos/${id}`, data).then(response => { 

            setMsg('Agendamento alterado com sucesso.');
            setClassMsg('success_msg');
          })
          .catch(error => {

              let msg_error = (error.response.status === 400) ? 
                  validation[error.response.data.validation.keys[0]] :
                  (error.response.data.msg) ? error.response.data.msg :
                  'Erro ao realizar a alteração, tente novamente.'

              setMsg(msg_error);
              setClassMsg('erro_msg');
          });

        } else {

          await api.post('agendamentos', data).then(response => { 
        
              setMsg('Agendamento realizado com sucesso.');
              setClassMsg('success_msg');
              clearForm();
  
              setTimeout(() => {
                  history.push('/agendamentos');
              }, 1500);
          })
          .catch(error => {
  
              let msg_error = (error.response.status === 400) ? 
                  validation[error.response.data.validation.keys[0]] :
                  (error.response.data.msg) ? error.response.data.msg :
                  'Erro ao realizar o cadastro, tente novamente.'
  
              setMsg(msg_error);
              setClassMsg('erro_msg');
          });
        }
        setLoading(false);
    }

    function clearForm() {
        setIdCliente(0);
        setIdTratamento(0);
        setHrDe('00:00');
        setHrAte('00:00');
    }

    async function handleExcluirAgendamento() {

      if (id > 0) {

        setLoading(true);
        await api.delete(`agendamentos/${id}`).then(response => { 

          alert('Agendamento excluído com sucesso.');
          history.push(`/agendamentos?dt_agendamento=${dt_agendamento}`);
        })
        .catch(error => {
          
          let msg_error = 'Erro ao realizar a exclusão, tente novamente.';
          setMsg(msg_error);
          setClassMsg('erro_msg');
        });
        setLoading(false);
      }
    }

    async function handleFinalizarAgendamento() {

      if (id > 0) {

        setLoading(true);
        await api.put(`agendamentos/finalizar/${id}`, { status: 'A'}).then(response => { 
            
          alert('Agendamento finalizado com sucesso.');

          api.post('/lancamento/agendamento', {id_agendamento: parseInt(id)}).then(response => {
            
            history.push(`/lancamentos/${response.data.id}?id_agendamento=${parseInt(id)}`);

          }).catch(error => {

            alert('Lançamento deste agendamento não foi criado. Verifique nos Lançamentos deste dia para confirmar os dados.');
            history.push(`/agendamentos?dt_agendamento=${dt_agendamento}`);
          });
        })
        .catch(error => {
  
            let msg_error = 'Erro ao realizar a finalização, tente novamente.';
            setMsg(msg_error);
            setClassMsg('erro_msg');
        });
        setLoading(false);
      }
    }

    return (
        <Header loading={loading}>
            <div className="general-container">
                <div className="content">
                    <h1>Agendamento para {(params.data !== undefined) ? (params.data).split('-').join('/') : dt_agendamento.split('-').reverse().join('/') }</h1>
                    <p>Uhuuuul \0/ Essa é a melhor parte né?</p>
                    <form onSubmit={handleAgendamento}>
                        <select value={id_cliente} onChange={e => setIdCliente(e.target.value)}>
                          {
                            (id_cliente === 0) ? <option value={id_cliente}>Selecione o cliente..</option> : ''
                          }
                          {
                            clientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.name}</option>)
                          }
                        </select>
                        <select value={id_tratamento} onChange={e => setIdTratamento(e.target.value)}>
                          {
                            (id_tratamento === 0) ? <option value={id_tratamento}>Selecione o tratamento..</option> : ''
                          }
                          {
                            tratamentos.map(tratamento => <option key={tratamento.id_tratamento} value={tratamento.id_tratamento}>{tratamento.nm_tratamento}</option>)
                          }
                        </select>
                        <div className="selectGroup">
                          <input type="time" value={hr_de} onChange={e => setHrDe(e.target.value)}/>
                          <input type="time" value={hr_ate} onChange={e => setHrAte(e.target.value)}/>
                        </div>
                        <div className="content-buttons">
                        <button className="button cancel" type="button" onClick={ () => history.goBack()}>Voltar</button>
                            {
                              (status !== 'A') ?
                              <button className="button" type="submit">{title}</button>
                              : <button className="button atendido" type="button" disabled="disabled">Atendimento já finalizado</button>
                            }
                        </div>
                        {
                          (status === 'P') ?
                          <button className="button btn-excluir" onClick={() => { if (window.confirm('Deseja realmente excluir esse agendamento?')) handleExcluirAgendamento() } }  type="button">Excluir</button>
                          : ''
                        }
                        {
                          (status === 'P') ?
                          <button className="button btn-finalizar" onClick={() => { if (window.confirm('Deseja realmente finalizar esse agendamento?')) handleFinalizarAgendamento() } }  type="button">Finalizar</button>
                          : ''
                        }
                        <p className={classMsg}>{msg}</p>
                    </form>
                </div>
            </div>
        </Header>
    );
} 