import React from 'react';
import '../App.css';
import githubIcon from "../hom/github.png";

function Programming() {
    return(
        <div className="Content-Div">
            <div className="Content-Header">
                <h1>Programming</h1>
                <h2 style={{color: "#cc3333"}}>~ Under Construction ~</h2>
            </div>
            <br /><br /><br /><br />
            <img src={githubIcon} className="Home-Icons" alt="" />
            <a className="Home-Link" href="https://github.com/daniel-christianson">github</a>
        </div>
    );
}

export default Programming;
