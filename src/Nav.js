import React from 'react';
import './App.css';
import Home from './hom/hom.js'
import About from './abt/abt.js'
import Resume from './rsm/rsm.js'
import Portfolio from './prt/prt.js'
import Programming from './prg/prg.js'
import Contact from './cnt/cnt.js'

const navigationArray = [
    {name: "home", dv: <Home />},
    {name: "about", dv: <About />},
    {name: "resume", dv: <Resume />},
    {name: "portfolio", dv: <Portfolio />},
    {name: "programming", dv: <Programming />},
    {name: "contact", dv: <Contact />},
];

export default navigationArray;