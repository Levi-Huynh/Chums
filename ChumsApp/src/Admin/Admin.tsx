import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ReportPage } from './ReportPage'
import { ReportsPage } from './ReportsPage'


export const Admin: React.FC = () => {
    return (
        <Switch>
            <Route path="/admin/reports/:id" component={ReportPage}></Route>
            <Route path="/admin/reports"><ReportsPage /></Route>
        </Switch>
    );
}


