import React from 'react';
import '../App.css';
import './prt.css';

function Portfolio() {
    return(
        <div className="Content-Div">
            <div className="Title-Header">
                <h1>Daniel Christianson</h1>
            </div>
            <div className="Content-Header">
                <h1>Portfolio</h1>
                <h2 style={{color: "#cc3333"}}>~ Under Construction ~</h2>
            </div>
            <ul className="Portfolio-List">
                <li>- PAINTING -</li>
                <li>- DIGITAL -</li>
                <li>- ANIMATION -</li>
                <li>- GRAPHIC DESIGN -</li>
                <li>- GAME DESIGN -</li>
            </ul>
        </div>
    );
}

export default Portfolio;
