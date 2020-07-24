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
import logo from './logo.svg';

function ListItem(props) {
  const navClick = () => props.onClickFunction(props.thisDiv);
  return (
    <li onClick={navClick}>
      {props.navName}
    </li>
  );
}

function Display(props) {
  return(
      <div>{props.divName}</div>
  );
}

function App() {
  const [name, setDiv] = useState(<Home />);
  const changeDiv = (blah) => setDiv(blah);
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Daniel Christianson</h1>
          <h2>Resume and Portfolio</h2>
          <ul>
            <Link to={"/Home"}>
              <ListItem onClickFunction={changeDiv} navName={'Home'} thisDiv={<Home />}/>
            </Link>
            <Link to={"/About"}>
              <ListItem onClickFunction={changeDiv} navName={'About'} thisDiv={<About />}/>
            </Link>
            <Link to={"/Resume"}>
              <ListItem onClickFunction={changeDiv} navName={'Resume'} thisDiv={<Resume />}/>
            </Link>
            <Link to={"/Portfolio"}>
              <ListItem onClickFunction={changeDiv} navName={'Portfolio'} thisDiv={<Portfolio />}/>
            </Link>
            <Link to={"/Programming"}>
              <ListItem onClickFunction={changeDiv} navName={'Programming'} thisDiv={<Programming />}/>
            </Link>
            <Link to={"/Contact"}>
              <ListItem onClickFunction={changeDiv} navName={'Contact'} thisDiv={<Contact />}/>
            </Link>
          </ul>
          <Display divName={name}/>
          <img src={logo} className="App-logo" alt="logo" />
          <Switch>
            <Route path="/Home"><Home /></Route>
            <Route path="/About"><About /></Route>
            <Route path="/Resume"><Resume /></Route>
            <Route path="/Portfolio"><Portfolio /></Route>
            <Route path="/Programming"><Programming /></Route>
            <Route path="/Contact"><Contact /></Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
