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

function AppNew() {
    return(
        <Router>
            <div className="App">
                <header className="App-header">
                    <ul>
                        <li><Link to={"/Home"}>Home</Link></li>
                        <li><Link to={"/About"}>About</Link></li>
                        <li><Link to={"/Resume"}>Resume</Link></li>
                        <li><Link to={"/Portfolio"}>Portfolio</Link></li>
                        <li><Link to={"/Programming"}>Programming</Link></li>
                        <li><Link to={"/Contact"}>Contact</Link></li>
                    </ul>

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



export default AppNew;
