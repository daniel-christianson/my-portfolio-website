import React from 'react';
import '../App.css';
import './abt.css'
import linkedinIcon from "../hom/linkedin.png";
import githubIcon from "../hom/github.png";

function About() {
    return(
        <div className="Content-Div">
            <div className="Title-Header">
                <h1>Daniel Christianson</h1>
            </div>
            <div className="Content-Header">
                <h1>About</h1>
            </div>
            <div className="About-Div">
                <p>
                    I'm an IT Support analyst with 10 years experience working in the Minneapolis area. After high school, I originally attended college to pursue a degree in visual arts, but I've always had an affinity for technology and a good eye for detail. I started working in IT during the spring of 2013 and have been in the field ever since. I enjoy projects, working on a team, problem solving, and the creation process.
                </p>
                <p>
                    I first started teaching myself scripting and programming on the job using PowerShell, Visual Basic, and FoxPro. I wrote scripts to automate my workflow. I overhauled an old in-house FoxPro script and turned it into a program with a GUI that had different options for endusers. I wrote an automated email script with PowerShell and VBA to send emails Outlook. I've continued to study programming via personal projects and online courses at places like Pluralsight. For example, at Pluralsight I've taken around 25 courses covering a large range of topics including: C#, Python, Web Design, JavaScript, React, Angular, GIT, Node JS, and Express JS.
                </p>
                <p>
                    I really enjoy project-based work and hope to continue down the path of programming for now. Please check out my resume and GitHub for more details and examples of things I've worked on.
                </p>
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
        </div>
    );
}

export default About;
