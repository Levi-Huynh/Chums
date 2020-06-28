import React from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';
import { ApiHelper } from '../Utils';

export const Logout = () => {
    document.cookie = "apiKey=";
    ApiHelper.apiKey = '';
    //React.useContext(UserContext).setUserName('');
    return <Redirect to="/" />
}