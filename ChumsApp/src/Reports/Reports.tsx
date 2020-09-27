import React from 'react';
import { Switch, Route } from "react-router-dom";
import { ReportsPage } from './ReportsPage'
import { ReportPage } from './ReportPage'


export const Reports: React.FC = () => {
    return (
        <Switch>
            <Route path="/reports/:id" component={ReportPage}></Route>
            <Route path="/reports"><ReportsPage /></Route>
        </Switch>
    );
}


