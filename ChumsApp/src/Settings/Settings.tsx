import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RolesPage } from './RolesPage'
import { RolePage } from './RolePage'
import { ExportPage } from './ExportPage'
import { ImportPage } from './ImportPage'
import { SettingsPage } from './SettingsPage'


export const Settings: React.FC = () => {
    return (
        <Switch>
            <Route path="/settings/roles/:id" component={RolePage}></Route>
            <Route path="/settings/import"><ImportPage /></Route>
            <Route path="/settings/export"><ExportPage /></Route>
            <Route path="/settings/roles"><RolesPage /></Route>
            <Route path="/settings"><SettingsPage /></Route>
        </Switch>
    );
}


