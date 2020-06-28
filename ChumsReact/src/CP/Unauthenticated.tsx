import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Login } from './Login'
import { Forgot } from './Forgot'

export const Unauthenticated = () => {
    return (
        <>
            <Switch>
                <Route path="/cp/login" component={Login} ></Route>
                <Route path="/cp/forgot"  ><Forgot /></Route>
                <Route path="/cp/"  ><Redirect to="/cp/login" /></Route>
            </Switch>
        </>
    )
}
