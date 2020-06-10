import React from 'react';
import UserContext from '../UserContext'
import AuthenticatedCP from './AuthenticatedCP'
import Login from './Login'

function ControlPanel(props) {
    const user = React.useContext(UserContext).user;
    return (user.apiKey === '') ? <Login /> : <AuthenticatedCP />
}
export default ControlPanel;