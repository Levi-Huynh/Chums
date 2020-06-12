import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { Header, Sidebar } from './Components'
import { PeoplePage } from './People/PeoplePage'
import { PersonPage } from './People/PersonPage'


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
                <a href="#" onClick={sidebarToggle} className="d-md-none" id="sidebarToggle"><i className="fas fa-bars"></i></a>
                <div className="row">
                    <Sidebar />
                    <main role="main" className="col-sm-12 ml-sm-auto col-md-10 pt-3">
                        <Switch>
                            <Route path="/cp/login"  ><Redirect to="/cp/people" /></Route>
                            <Route path="/cp/groups">Groups</Route>
                            <Route path="/cp/people/:id" component={PersonPage}></Route>
                            <Route path="/cp/people"><PeoplePage /></Route>
                            <Route path="/cp"><div>Control Panel</div></Route>
                        </Switch>
                    </main>
                </div>
            </div>
            <script src="/js/cp.js"></script>
        </>
    );
}

