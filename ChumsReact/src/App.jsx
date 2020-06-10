import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ControlPanel from './CP/ControlPanel';
import { UserProvider } from './UserContext'

function App() {
  const user = { apiKey: 'notSet', name: 'notSet' }

  //const user = useContext(UserContext)

  return (
    <UserProvider value={user}>
      <Router>
        <Switch>
          <Route path="/cp"><ControlPanel /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </Router>
    </UserProvider>
  );
}



export default App;
