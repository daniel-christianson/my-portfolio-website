import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
} from "react-router-dom";
import './App.css';
import navigationArray from './Nav.js'

function LinksList(){
    const location = useLocation();
    const links = navigationArray.map(function(item) {
        if(location.pathname !== ("/" + item.name)){
            return <li className="Nav-List-Item"><Link className="Link-Tag" to={"/" + item.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Link></li>
        } else if (location.pathname === '/home'){
            return (
                <div className="Home-Div">
                    <h1>Daniel Christianson</h1>
                    <h2>Resume and Portfolio</h2>
                </div>
            );
        }
    })
    return(
        links
    );
}

function Routes(){
    const routes = navigationArray.map(item => (<Route path={"/" + item.name}>{item.dv}</Route>));
    return(
        routes
    );
}

function App(){
    return(
        <Router>
            <div className="App">
                <header className="App-header">
                    <ul className="Nav-List">
                        <LinksList />
                    </ul>
                    <Switch>
                        <Routes />
                    </Switch>
                </header>
            </div>
        </Router>
    );
}

export default App;
