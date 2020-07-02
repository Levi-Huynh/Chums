import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Header, Sidebar } from './Components'
import { PeoplePage } from './People/PeoplePage'
import { PersonPage } from './People/PersonPage'
import { GroupsPage } from './Groups/GroupsPage'
import { GroupPage } from './Groups/GroupPage'
import { AttendancePage } from './Attendance/AttendancePage'
import { DonationsPage } from './Donations/DonationsPage'
import { DonationBatchPage } from './Donations/DonationBatchPage'
import { FundPage } from './Donations/FundPage'
import { FormsPage } from './Forms/FormsPage'
import { RolesPage } from './Settings/RolesPage'
import { RolePage } from './Settings/RolePage'
import { ImportPage } from './Settings/ImportPage'
import { SettingsPage } from './Settings/SettingsPage'
import { FormPage } from './Forms/FormPage';
import { Row } from 'react-bootstrap';

export const Authenticated = () => {

    const sidebarToggle = () => {
        var sidebar = document.getElementById('sidebar');
        if (sidebar.className.indexOf('d-none') > -1) {
            sidebar.className = sidebar.className.replace('d-none', '').trim();
        } else {
            sidebar.className = (sidebar.className + ' d-none').trim();
        }
    }


    return (
        <>
            <link rel="stylesheet" href="/css/cp.css" />
            <Header></Header>
            <div className="container-fluid">
                <a href="about:blank" onClick={sidebarToggle} className="d-md-none" id="sidebarToggle"><i className="fas fa-bars"></i></a>
                <Row>
                    <Sidebar />
                    <main role="main" className="col-sm-12 ml-sm-auto col-md-10 pt-3">
                        <Switch>
                            <Route path="/login"  ><Redirect to="/people" /></Route>
                            <Route path="/people/:id" component={PersonPage}></Route>
                            <Route path="/people"><PeoplePage /></Route>
                            <Route path="/groups/:id" component={GroupPage}></Route>
                            <Route path="/groups"><GroupsPage /></Route>
                            <Route path="/attendance"><AttendancePage /></Route>
                            <Route path="/donations/funds/:id" component={FundPage}></Route>
                            <Route path="/donations/:id" component={DonationBatchPage}></Route>
                            <Route path="/donations"><DonationsPage /></Route>
                            <Route path="/forms/:id" component={FormPage}></Route>
                            <Route path="/forms"><FormsPage /></Route>
                            <Route path="/settings/roles/:id" component={RolePage}></Route>
                            <Route path="/settings/import"><ImportPage /></Route>
                            <Route path="/settings/roles"><RolesPage /></Route>
                            <Route path="/settings"><SettingsPage /></Route>
                            <Route path="/cp"><Redirect to="/people" /></Route>
                        </Switch>
                    </main>
                </Row>
            </div>
            <script src="/js/cp.js"></script>
        </>
    );
}

