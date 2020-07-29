import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Home from './hom/hom.js'
import About from './abt/abt.js'
import Resume from './rsm/rsm.js'
import Portfolio from './prt/prt.js'
import Programming from './prg/prg.js'
import Contact from './cnt/cnt.js'

function App(){
  const navObj = [
      {name: "home", dv: <Home />},
      {name: "about", dv: <About />},
      {name: "resume", dv: <Resume />},
      {name: "portfolio", dv: <Portfolio />},
      {name: "programming", dv: <Programming />},
      {name: "contact", dv: <Contact />}
  ];
  const links = navObj.map(item => (<li><Link to={"/" + item.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Link></li>));
  const routes = navObj.map(item => (<Route path={"/" + item.name}>{item.dv}</Route>));
  return(
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Daniel Christianson</h1>
            <h2>Resume and Portfolio</h2>
            <ul>
                {links}
            </ul>
            <Switch>
                {routes}
            </Switch>
          </header>
        </div>
      </Router>
  );
}

export default App;
