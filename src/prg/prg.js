import React, {useState} from 'react';
import '../App.css';
import './prg.css';
import { CodeBlock } from "react-code-blocks";
import githubIcon from "../hom/github.png";

function ShowHideContent(props){
    const [state, setState] = useState(false);
    const [title, setTitle] = useState(props.titleInitialState /* example: a 'show' button */);
    function onClickFunction(){
        if(state === true){
            setState(false);
            setTitle(props.titleOnClickStateTrue /* example: a 'show' button */);
        } else {
            setState(true);
            setTitle(props.titleOnClickStateFalse /* example: a 'hide' button */);
        }
    }
    return (
        <div>
            <li className="Show-Hide-Content" onClick={onClickFunction}>
                {title}
            </li>
            {state ? <HiddenContent hiddenContentClass={props.showHideContentClass} hiddenContent={props.showHideContent} /> : null}
        </div>
    );
}


function HiddenContent(props){
    return(
        <p className={props.hiddenContentClass}>
            {props.hiddenContent}
        </p>
    );
}

function Programming() {
    return(
        <div className="Content-Div">
            <div className="Title-Header">
                <h1>Daniel Christianson</h1>
            </div>
            <div className="Content-Header">
                <h1>Programming</h1>
                {/*<h2 style={{color: "#cc3333"}}>~ Under Construction ~</h2>*/}
                <br />
                <img src={githubIcon} className="Home-Icons" alt="" />
                <a className="Home-Link" href="https://github.com/daniel-christianson">github</a>
            </div>
            <div>
                <ul className="Programming-List">
                    <ShowHideContent
                        titleInitialState="Email Script"
                        titleOnClickStateTrue="Email Script"
                        titleOnClickStateFalse="Email Script (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <CodeBlock
                                text='console.log("Hello world");'
                                language='javascript'
                                showLineNumbers={true}
                            />
                        }
                    />
                    <ShowHideContent
                        titleInitialState="Find Aspect Ratio"
                        titleOnClickStateTrue="Find Aspect Ratio"
                        titleOnClickStateFalse="Find Aspect Ratio (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <CodeBlock
                                text='console.log("Hello world");'
                                language='javascript'
                                showLineNumbers={true}
                            />
                        }
                    />
                </ul>
            </div>
        </div>
    );
}

export default Programming;
