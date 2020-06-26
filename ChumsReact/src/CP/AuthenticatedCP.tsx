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
import { FormPage } from './Forms/FormPage';


export const AuthenticatedCP = () => {

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
                <div className="row">
                    <Sidebar />
                    <main role="main" className="col-sm-12 ml-sm-auto col-md-10 pt-3">
                        <Switch>
                            <Route path="/cp/login"  ><Redirect to="/cp/people" /></Route>
                            <Route path="/cp/people/:id" component={PersonPage}></Route>
                            <Route path="/cp/people"><PeoplePage /></Route>
                            <Route path="/cp/groups/:id" component={GroupPage}></Route>
                            <Route path="/cp/groups"><GroupsPage /></Route>
                            <Route path="/cp/attendance"><AttendancePage /></Route>
                            <Route path="/cp/donations/funds/:id" component={FundPage}></Route>
                            <Route path="/cp/donations/:id" component={DonationBatchPage}></Route>
                            <Route path="/cp/donations"><DonationsPage /></Route>
                            <Route path="/cp/forms/:id" component={FormPage}></Route>
                            <Route path="/cp/forms"><FormsPage /></Route>
                            <Route path="/cp/settings/roles/:id" component={RolePage}></Route>
                            <Route path="/cp/settings"><RolesPage /></Route>
                            <Route path="/cp"><Redirect to="/cp/people" /></Route>
                        </Switch>
                    </main>
                </div>
            </div>
            <script src="/js/cp.js"></script>
        </>
    );
}

