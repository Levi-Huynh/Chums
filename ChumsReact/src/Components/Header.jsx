import React, { Fragment } from 'react';
import UserContext from '../UserContext'

function Header(props) {
    const user = React.useContext(UserContext).user;
    return (
        <Fragment>
            <nav className="navbar navbar-expand navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="/"><img src="/images/logo.png" alt="logo" /></a>
                <div className="collapse navbar-collapse" id="navbar">
                    <ul className="navbar-nav mr-auto">
                    </ul>
                    <div className="navbar-nav ml-auto">{user.name}</div>
                </div>
            </nav>
            <div id="userMenu"></div>
            <div id="navSpacer" ></div>
        </Fragment>
    );
}

export default Header;

