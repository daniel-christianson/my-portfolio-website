import React, {useState} from 'react';
import './App.css';
import Home from './hom/hom.js'
import About from './abt/abt.js'
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
    <div className="App">
      <header className="App-header">
        <h1>Daniel Christianson</h1>
        <h2>Resume and Portfolio</h2>
        <ul>
          <ListItem onClickFunction={changeDiv} navName={'Home'} thisDiv={<Home />}/>
          <ListItem onClickFunction={changeDiv} navName={'About'} thisDiv={<About />}/>
          <ListItem onClickFunction={changeDiv} navName={'Portfolio'} thisDiv={<Portfolio />}/>
          <ListItem onClickFunction={changeDiv} navName={'Programming'} thisDiv={<Programming />}/>
          <ListItem onClickFunction={changeDiv} navName={'Contact'} thisDiv={<Contact />}/>
        </ul>
        <Display divName={name}/>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
