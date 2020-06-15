import React from 'react';
import UserContext from '../UserContext'
import { AuthenticatedCP } from './AuthenticatedCP'
import { Login } from './Login'
import { ApiHelper } from './Components';

export const ControlPanel = () => {
    const user = React.useContext(UserContext).userName;
    return (ApiHelper.apiKey === '') ? <Login /> : <AuthenticatedCP />
}
