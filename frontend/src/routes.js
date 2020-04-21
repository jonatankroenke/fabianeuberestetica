import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Logon            from './pages/Logon';
import Home             from './pages/Home';
import Config           from './pages/Config';
import ClientesNew      from './pages/ClientesNew';
import ClientesList     from './pages/ClientesList';
import TratamentosList  from './pages/TratamentosList';
import TratamentosNew   from './pages/TratamentosNew';
import AgendamentosList from './pages/AgendamentosList';
import AgendamentosNew  from './pages/AgendamentosNew';
import LancamentosList  from './pages/LancamentosList';
import LancamentosNew   from './pages/LancamentosNew';

import { isAuthenticated } from "./services/auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Logon}/>
            <Route path="/logon" component={Logon}/>
            <PrivateRoute path="/home" component={Home} />
            <PrivateRoute path="/config" component={Config} />
            <PrivateRoute path="/clientes" exact component={ClientesList} />
            <PrivateRoute path="/clientes/new" component={ClientesNew} />
            <PrivateRoute path="/clientes/:id" component={ClientesNew} />
            <PrivateRoute path="/tratamentos" exact component={TratamentosList} />
            <PrivateRoute path="/tratamentos/new" component={TratamentosNew} />
            <PrivateRoute path="/tratamentos/:id" component={TratamentosNew} />
            <PrivateRoute path="/agendamentos" exact component={AgendamentosList} />
            <PrivateRoute path="/agendamentos/new/:data" component={AgendamentosNew} />
            <PrivateRoute path="/agendamentos/:id" component={AgendamentosNew} />
            <PrivateRoute path="/lancamentos" exact component={LancamentosList} />
            <PrivateRoute path="/lancamentos/new" component={LancamentosNew} />
            <PrivateRoute path="/lancamentos/:id" component={LancamentosNew} />
            <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;

