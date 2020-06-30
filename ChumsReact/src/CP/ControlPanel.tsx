import React from 'react';
import UserContext from '../UserContext'
import { Authenticated } from './Authenticated'
import { Unauthenticated } from './Unauthenticated'
import { ApiHelper } from './Components';
import { Switch, Route } from "react-router-dom";
import { Logout } from './Logout';

export const ControlPanel = () => {
    const user = React.useContext(UserContext).userName;
    const getHandler = () => { return (ApiHelper.apiKey === '') ? <Unauthenticated /> : <Authenticated />; }
    return (
        <Switch>
            <Route path="/cp/logout"><Logout /></Route>
            <Route path="/cp">{getHandler()}</Route>
        </Switch>
    );

}
