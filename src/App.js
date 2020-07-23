import React, {useState} from 'react';
import './App.css';
import Home from './hom/hom.js'
import About from './abt/abt.js'
import Resume from './rsm/rsm.js'
import Portfolio from './prt/prt.js'
import Programming from './prg/prg.js'
import Contact from './cnt/cnt.js'
import logo from './logo.svg';

const pages = [{div: <Home />}, {div: <About />}, {div: <Resume />}, {div: <Portfolio />}, {div: <Programming />}, {div: <Contact />}];
//const pages = [{name: "dan"},{name: "bree"}];

const List = (props) => (
    <div className="App">
        <ul>
            {pages.map(blah => <ListItem {...blah}/>)}
        </ul>
    </div>
);

class ListItem extends React.Component {
    render() {
        const item = this.props;
        return(
            item.div
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <List />
            </div>
        );
    }
}

export default App;