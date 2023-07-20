import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useLocation
} from "react-router-dom";
import './App.css';
import navigationArray from './Nav.js'
import linkedinIcon from "./hom/linkedin.png";
import githubIcon from "./hom/github.png";

function NavigationListItems(){
    const location = useLocation();
    const links = navigationArray.map(function(item){
        if (location.pathname === "/home" && location.pathname === ("/" + item.name)){
            // create homepage li's (suppress home li)
            return null;
        } else if (location.pathname === "/home" && location.pathname !== ("/" + item.name)){
            // create homepage li's (create all other li's)
            return(
                <li className="Home-Nav-List-Item" key={item.name}>
                    <Link className="Link-Tag" to={"/" + item.name}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Link>
                </li>
            );
        } else if (location.pathname === ("/" + item.name)){
            // create non-homepage li's (li for current page is not a link)
            return(
                <li className="Nav-List-Item-Selected" key={item.name}>
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </li>
            );
        } else {
            // create non-homepage li's (create all other li's when NOT on homepage)
            return(
                <li className="Nav-List-Item" key={item.name}>
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
    const routes = navigationArray.map(item => (<Route path={"/" + item.name} key={"route-" + item.name}>{item.dv}</Route>));
    return(
        routes
    );
}

function App(){
    return (
        <Router>
            <div className="App-Div">
                <header className="App-Header">
                    <div className="Nav-Div">
                        <ul>
                            <NavigationListItems/>
                        </ul>
                    </div>
                    <Switch>
                        <Redirect exact from='/' to='/home'/>
                        <Routes/>
                    </Switch>
                </header>
            </div>
        </Router>
    );
}

export default App;
