import React from 'react';
import './App.css';
import { Home } from './Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ControlPanel } from './CP/ControlPanel';
import { UserProvider } from './UserContext'

export const App = () => {

  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route path="/cp"><ControlPanel /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}


