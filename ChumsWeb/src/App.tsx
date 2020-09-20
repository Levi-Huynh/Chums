import React from 'react';
import './App.css';
import { Home } from './Home';
import { Privacy } from './Privacy';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/privacy"><Privacy /></Route>
        <Route path="/"><Home /></Route>
      </Switch>
    </Router>
  );
}
export default App;

