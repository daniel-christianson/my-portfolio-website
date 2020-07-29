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
      <Link className="Link-Tag" to={"/" + props.navName}>
        {props.navName}
      </Link>
      <Switch>
        <Route path={"/" + props.navName}>{props.thisDiv}</Route>
      </Switch>
    </li>
  );
}

function Display(props) {
  return (
      props.divName
  );
}

function App(){
  const navList = [<Home />, <About />, <Resume />, <Portfolio />, <Programming />, <Contact />];
  return(
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Daniel Christianson</h1>
            <h2>Resume and Portfolio</h2>
            <ul>
              <li>
                <Link>

                </Link>
                <Switch>

                </Switch>
              </li>
            </ul>
          </header>
        </div>
      </Router>
  );
}

// function App() {
//   const [name, setDiv] = useState(<Home />);
//   const changeDiv = (blah) => setDiv(blah);
//   return (
//     <Router>
//       <div className="App">
//         <header className="App-header">
//           <h1>Daniel Christianson</h1>
//           <h2>Resume and Portfolio</h2>
//           <ul>
//             <ListItem onClickFunction={changeDiv} navName={'Home'} thisDiv={<Home />}/>
//             <ListItem onClickFunction={changeDiv} navName={'About'} thisDiv={<About />}/>
//             <ListItem onClickFunction={changeDiv} navName={'Resume'} thisDiv={<Resume />}/>
//             <ListItem onClickFunction={changeDiv} navName={'Portfolio'} thisDiv={<Portfolio />}/>
//             <ListItem onClickFunction={changeDiv} navName={'Programming'} thisDiv={<Programming />}/>
//             <ListItem onClickFunction={changeDiv} navName={'Contact'} thisDiv={<Contact />}/>
//           </ul>
//           <Display divName={name}/>
//         </header>
//       </div>
//     </Router>
//   );
// }

export default App;
