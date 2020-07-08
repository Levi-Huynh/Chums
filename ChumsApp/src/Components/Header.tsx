import React from 'react';
import { UserHelper } from './';
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const toggleUserMenu = (e: React.MouseEvent) => { e.preventDefault(); setShowUserMenu(!showUserMenu); }

    const getUserMenu = () => {
        if (showUserMenu) return <div id="userMenu"><Link to="/logout">Logout</Link></div>
        else return null;
    }

    return (
        <>
            <nav className="navbar navbar-expand navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="/"><img src="/images/logo.png" alt="logo" /></a>
                <div className="collapse navbar-collapse" id="navbar">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <div className="navbar-nav ml-auto"><a href="about:blank" onClick={toggleUserMenu}>{UserHelper.person.displayName} <i className="fas fa-caret-down"></i></a></div>
                </div>
            </nav>
            {getUserMenu()}
            <div id="navSpacer" ></div>
        </>
    );
}
