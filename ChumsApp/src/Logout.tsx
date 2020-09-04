import React from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';
import { ApiHelper } from './Utils';
import UserContext from './UserContext'

export const Logout = () => {
    const context = React.useContext(UserContext)

    document.cookie = "jwt=";
    ApiHelper.jwt = '';
    context.setUserName('');
    return <Redirect to="/" />
}