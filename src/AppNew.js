// import React, {useState} from 'react';
// import './App.css';
// import Home from './hom/hom.js'
// import About from './abt/abt.js'
// import Resume from './rsm/rsm.js'
// import Portfolio from './prt/prt.js'
// import Programming from './prg/prg.js'
// import Contact from './cnt/cnt.js'
// import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
//
// function NavLink(props){
//     const navArray = [<Home />, <About />, <Resume />, <Portfolio />, <Programming />, <Contact />];
//     return(
//         <Router>
//             <div className="App">
//                 <header className="App-header">
//                     <ul>
//                         <li><Link to={"/home"}>Home</Link></li>
//                         <li><Link to={"/about"}>About</Link></li>
//                         <li><Link to={"/resume"}>Resume</Link></li>
//                         <li><Link to={"/portfolio"}>Portfolio</Link></li>
//                         <li><Link to={"/programming"}>Programming</Link></li>
//                         <li><Link to={"/contact"}>Contact</Link></li>
//                     </ul>
//
//                     <Switch>
//                         <Route path="/home">{navArray[0]}</Route>
//                         <Route path="/about">{navArray[1]}</Route>
//                         <Route path="/resume">{navArray[2]}</Route>
//                         <Route path="/portfolio">{navArray[3]}</Route>
//                         <Route path="/programming">{navArray[4]}</Route>
//                         <Route path="/contact">{navArray[5]}</Route>
//                     </Switch>
//                 </header>
//             </div>
//         </Router>
//     );
// }
//
// function Display(props){
//     return props.divName;
// }
//
// function AppNew() {
//     return(
//         const [name, setDiv] = useState(<NavLink >)
//         <Display divName={name}/>
//     );
// }
//
// export default AppNew;
