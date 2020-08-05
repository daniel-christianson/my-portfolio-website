import React from 'react';
import '../App.css';
import './prg.css';
import githubIcon from "../hom/github.png";

function Programming() {
    return(
        <div className="Content-Div">
            <div className="Content-Header">
                <h1>Programming</h1>
                <h2 style={{color: "#cc3333"}}>~ Under Construction ~</h2>
            </div>
            <div className="Programming-Div">
                <img src={githubIcon} className="Home-Icons" alt="" />
                <a className="Home-Link" href="https://github.com/daniel-christianson">github</a>
            </div>
        </div>
    );
}

export default Programming;
