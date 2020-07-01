import React from 'react';
import './App.css';
import { Home } from './Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserProvider } from './UserContext'

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Switch>
          <Route path="/"><Home /></Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}
export default App;

