import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import UserContext from '../UserContext'
import Header from '../Components/Header'
import Sidebar from './Components/Sidebar'
import PeoplePage from './People/PeoplePage'
import PersonPage from './People/PersonPage'

function AuthenticatedCP(props) {
    const user = React.useContext(UserContext).user;


    //*** warning on hreef=javascript:sidebarToggle().  Not sure how to include a js file and call from react.
    return (
        <Fragment>
            <link rel="stylesheet" href="/css/cp.css" />
            <Header></Header>
            <div className="container-fluid">
                <a href="javascript:sidebarToggle()" className="d-md-none" id="sidebarToggle"><i className="fas fa-bars"></i></a>
                <div className="row">
                    <Sidebar />
                    <main role="main" className="col-sm-12 ml-sm-auto col-md-10 pt-3">
                        <Switch>
                            <Route path="/cp/login"  ><Redirect to="/cp/people" /></Route>
                            <Route path="/cp/groups">Groups</Route>
                            <Route path="/cp/people/:id" component={PersonPage}></Route>
                            <Route path="/cp/people"><PeoplePage /></Route>
                            <Route path="/cp">
                                <div>
                                    Control Panel
                                        {user.apiKey}
                                </div>
                            </Route>
                        </Switch>
                    </main>
                </div>
            </div>



            <script src="/js/cp.js"></script>
        </Fragment>
    );
}
export default AuthenticatedCP;