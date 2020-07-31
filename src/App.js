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

function NavigationListItems(){
    const location = useLocation();
    const links = navigationArray.map(function(item){
        if (location.pathname === "/home" && location.pathname === ("/" + item.name)){
            // homepage list items (no home list item will appear when on the homepage)
            return null;
        } else if (location.pathname === "/home" && location.pathname !== ("/" + item.name)){
            // homepage list items (all other list items when on the homepage)
            return(
                <li className="Home-Nav-List-Item">
                    <Link className="Link-Tag" to={"/" + item.name}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Link>
                </li>
            );
        } else if (location.pathname === ("/" + item.name)){
            // non-homepage list items (current page list item is not a link)
            return(
                <li className="Nav-List-Item-Selected">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </li>
            );
        } else {
            // non-homepage list items (all other list items when NOT on homepage)
            return(
                <li className="Nav-List-Item">
                    <Link className="Link-Tag" to={"/" + item.name}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Link>
                </li>
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
            <div className="App-Div">
                <header className="App-Header">
                    <ul>
                        <NavigationListItems />
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
