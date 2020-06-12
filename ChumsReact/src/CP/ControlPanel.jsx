import React from 'react';
import UserContext from '../UserContext'
import { AuthenticatedCP } from './AuthenticatedCP'
import { Login } from './Login'
import { ApiHelper } from './Components';

export const ControlPanel = props => {
    //***couldn't figure out how to convert UserContext to typescript

    const user = React.useContext(UserContext).user;
    return (ApiHelper.apiKey === '') ? <Login /> : <AuthenticatedCP />
}
