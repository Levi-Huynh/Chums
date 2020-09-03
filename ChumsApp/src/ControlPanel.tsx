import React from 'react';
import UserContext from './UserContext'
import { Authenticated } from './Authenticated'
import { Unauthenticated } from './Unauthenticated'
import { ApiHelper } from './Components';
import { Switch, Route } from "react-router-dom";
import { Logout } from './Logout';

export const ControlPanel = () => {
    var user = React.useContext(UserContext).userName; //to force rerender on login
    if (user === null) return null;
    const getHandler = () => { return (ApiHelper.jwt === '') ? <Unauthenticated /> : <Authenticated />; }
    return (
        <Switch>
            <Route path="/logout"><Logout /></Route>
            <Route path="/">{getHandler()}</Route>
        </Switch>
    );
}
