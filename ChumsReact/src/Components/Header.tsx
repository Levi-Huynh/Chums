import React from 'react';
import { UserHelper } from './';

export const Header: React.FC = () => {
    return (
        <>
            <nav className="navbar navbar-expand navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="/"><img src="/images/logo.png" alt="logo" /></a>
                <div className="collapse navbar-collapse" id="navbar">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <div className="navbar-nav ml-auto">{UserHelper.person.displayName}</div>
                </div>
            </nav>
            <div id="userMenu"></div>
            <div id="navSpacer" ></div>
        </>
    );
}
