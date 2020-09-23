import React from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';
import { ApiHelper } from './Utils';
import UserContext from './UserContext'

export const Logout = () => {
    const context = React.useContext(UserContext)

    document.cookie = "jwt=";
    console.log(document.cookie);
    ApiHelper.jwt = '';
    ApiHelper.amJwt = '';
    context.setUserName('');
    //return <Redirect to="/" /> //the cookie doesn't get updated.
    window.location.href = '/';
    return <></>;

}