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

const nav = [<Home />, <About />, <Resume />, <Portfolio />, <Programming />, <Contact />]

function Nav(){
    return(
        <Router>
            <div className="App">
                <header className="App-header">
                    <ul>
                        <li><Link to={"/home"}>Home</Link></li>
                        <li><Link to={"/about"}>About</Link></li>
                        <li><Link to={"/resume"}>Resume</Link></li>
                        <li><Link to={"/portfolio"}>Portfolio</Link></li>
                        <li><Link to={"/programming"}>Programming</Link></li>
                        <li><Link to={"/contact"}>Contact</Link></li>
                    </ul>

                    <Switch>
                        <Route path="/home"><Home /></Route>
                        <Route path="/about"><About /></Route>
                        <Route path="/resume"><Resume /></Route>
                        <Route path="/portfolio"><Portfolio /></Route>
                        <Route path="/programming"><Programming /></Route>
                        <Route path="/contact"><Contact /></Route>
                    </Switch>
                </header>
            </div>
        </Router>
    );
}

export default Nav;
