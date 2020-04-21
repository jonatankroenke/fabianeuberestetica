import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles.css';
import { logout } from "../../services/auth";

import LogoImg from '../../assets/logo_min.png';
import AccountMultipleIcon    from 'mdi-react/AccountMultipleIcon';
import FormatListChecksIcon   from 'mdi-react/FormatListChecksIcon';
import CashMultipleIcon       from 'mdi-react/CashMultipleIcon';
import FormatListBulletedIcon from 'mdi-react/FormatListBulletedIcon';
import CloseIcon              from 'mdi-react/CloseIcon';
import ExitToAppIcon          from 'mdi-react/ExitToAppIcon';
import RotateRightIcon        from 'mdi-react/RotateRightIcon';
import ManufacturingIcon      from 'mdi-react/ManufacturingIcon';
import CalendarBlankIcon      from 'mdi-react/CalendarDayIcon';

export default function Header(props) {
    
    const [menuVisible, setMenuVisible] = useState(false);
    const history  = useHistory();
    const [menuMobileIcon, setMenuMobileIcon] = useState(<FormatListBulletedIcon/>);

    function handleLogout() {
        logout();
        history.push('/logon');
    }

    function toogleMenu(e) {
        e.preventDefault();
        setMenuVisible(menuVisible ? false : true);
        setMenuMobileIcon(menuVisible ? <FormatListBulletedIcon/> : <CloseIcon/>)
    }

    return (
        <div className="container-menu">
            <div className="header">
                <Link to="#" className="nav-trigger" onClick={toogleMenu}>
                    {menuMobileIcon}
                </Link>
                <div className="logo">
                    <Link to="/home"><img src={LogoImg} alt="Fabiane Uber Estética" /></Link>
                </div>
                <button onClick={handleLogout} className="logout-button"><ExitToAppIcon color="#c58c80" />Sair</button>
            </div>
            <div className="content-principal">
                <div className={menuVisible ? 'side-nav visible' : 'side-nav' }>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/clientes">
                                    <AccountMultipleIcon color="#fff" />Clientes
                                </Link>
                            </li>
                            <li>
                                <Link to="/tratamentos">
                                    <FormatListChecksIcon color="#fff" />Tratamentos
                                </Link>
                            </li>
                            <li>
                                <Link to="/lancamentos">
                                    <CashMultipleIcon color="#fff" />Lançamentos
                                </Link>
                            </li>
                            <li>
                                <Link to="/agendamentos">
                                    <CalendarBlankIcon color="#fff" />Agendamentos
                                </Link>
                            </li>
                            <li>
                                <Link to="/config">
                                    <ManufacturingIcon color="#fff" />Configurações
                                </Link>
                            </li>
                            <li>
                                <Link to="#" onClick={handleLogout} className="logout-button-mobile"><ExitToAppIcon color="#fff" />Sair</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className={(props.loading) ? 'main-content loading' : 'main-content'}>
                    <div className="loadPage"><RotateRightIcon/></div>
                    {props.children}
                </div>
            </div>
        </div>
    )
}