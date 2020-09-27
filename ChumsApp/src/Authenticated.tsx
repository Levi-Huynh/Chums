import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Header } from './Components'
import { PeoplePage } from './People/PeoplePage'
import { PersonPage } from './People/PersonPage'
import { GroupsPage } from './Groups/GroupsPage'
import { GroupPage } from './Groups/GroupPage'
import { AttendancePage } from './Attendance/AttendancePage'
import { DonationsPage } from './Donations/DonationsPage'
import { DonationBatchPage } from './Donations/DonationBatchPage'
import { FundPage } from './Donations/FundPage'
import { FormsPage } from './Forms/FormsPage'
import { ReportPage } from './Admin/ReportPage'
import { ReportsPage } from './Admin/ReportsPage'
import { RolesPage } from './Settings/RolesPage'
import { RolePage } from './Settings/RolePage'
import { ExportPage } from './Settings/ExportPage'
import { ImportPage } from './Settings/ImportPage'
import { SettingsPage } from './Settings/SettingsPage'
import { FormPage } from './Forms/FormPage';

export const Authenticated = () => {

    return (
        <>
            <link rel="stylesheet" href="/css/cp.css" />
            <Header></Header>
            <div className="container">
                <Switch>
                    <Route path="/login"  ><Redirect to="/people" /></Route>
                    <Route path="/people/:id" component={PersonPage}></Route>
                    <Route path="/people"><PeoplePage /></Route>
                    <Route path="/groups/:id" component={GroupPage}></Route>
                    <Route path="/groups"><GroupsPage /></Route>
                    <Route path="/attendance"><AttendancePage /></Route>
                    <Route path="/admin/reports/:id" component={ReportPage}></Route>
                    <Route path="/admin/reports"><ReportsPage /></Route>
                    <Route path="/donations/funds/:id" component={FundPage}></Route>
                    <Route path="/donations/:id" component={DonationBatchPage}></Route>
                    <Route path="/donations"><DonationsPage /></Route>
                    <Route path="/forms/:id" component={FormPage}></Route>
                    <Route path="/forms"><FormsPage /></Route>
                    <Route path="/settings/roles/:id" component={RolePage}></Route>
                    <Route path="/settings/import"><ImportPage /></Route>
                    <Route path="/settings/export"><ExportPage /></Route>
                    <Route path="/settings/roles"><RolesPage /></Route>
                    <Route path="/settings"><SettingsPage /></Route>
                    <Route path="/cp"><Redirect to="/people" /></Route>
                </Switch>

            </div>
            <script src="/js/cp.js"></script>
        </>
    );
}

