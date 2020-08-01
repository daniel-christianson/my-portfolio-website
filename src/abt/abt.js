import React from 'react';
import '../App.css';
import './abt.css'
import linkedinIcon from "../hom/linkedin.png";
import githubIcon from "../hom/github.png";

function About() {
    return(
        <div className="Content-Div">
            <div className="Content-Header">
                <h1>About</h1>
            </div>
            <div className="About-Div">
                <p>
                    I'm an IT support specialist of 7 years working out of the Minneapolis area in MN.
                    My education background was in media arts and fine arts, but for now I've found a stable career
                    in technology.
                </p>
                <p>
                    I really enjoy project-based work and after a lot personal projects and on-job scripting
                    experience, I've been trying to step up my game and learn programming. I built this website
                    with Javascript and React. For more examples of my work please browse my website here or check
                    out my github.
                </p>
            </div>
            <ul className="Home-List">
                <li className="Home-List-Item" key="home-linkedin-icon">
                    <img src={linkedinIcon} className="Home-Icons" alt="" />
                    <a className="Home-Link" href="https://www.linkedin.com/in/daniel-s-christianson">linkedin</a>
                </li>
                <li className="Home-List-Item" key="home-github-icon">
                    <img src={githubIcon} className="Home-Icons" alt="" />
                    <a className="Home-Link" href="https://github.com/daniel-christianson">github</a>
                </li>
            </ul>
        </div>
    );
}

export default About;
