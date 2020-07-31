import React from 'react';
import '../App.css';
import './prt.css';

function Portfolio() {
    return(
        <div className="Content-Div">
            <div className="Content-Header">
                <h1>Portfolio</h1>
            </div>
            <ul className="Portfolio-List">
                <li>- PAINTING -</li>
                <li>- DIGITAL -</li>
                <li>- ANIMATION -</li>
                <li>- GRAPHIC DESIGN -</li>
                <li>- VIDEO GAME WORK -</li>
            </ul>
        </div>
    );
}

export default Portfolio;
