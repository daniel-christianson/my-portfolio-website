import React, {useState} from 'react';
import '../App.css';
import './prg.css';
import emailScript from './email-script/code-blocks.js';
import aspectRatioScript from './aspect-ratio-script/code-blocks.js';
import { CodeBlock, dracula, tomorrowNightBlue, tomorrowNightEighties } from "react-code-blocks";
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
                    <h3>Find Aspect Ratio Script</h3>
                    <ShowHideContent
                        titleInitialState="JavaScript"
                        titleOnClickStateTrue="JavaScript"
                        titleOnClickStateFalse="JavaScript (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>find_aspect_ratio.js</p>
                                <CodeBlock
                                    text={aspectRatioScript.javaScript}
                                    language='javascript'
                                    showLineNumbers={true}
                                    theme={dracula}
                                />
                            </React.Fragment>
                        }
                    />
                    <ShowHideContent
                        titleInitialState="PowerShell"
                        titleOnClickStateTrue="PowerShell"
                        titleOnClickStateFalse="PowerShell (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>find_aspect_ratio.ps1</p>
                                <CodeBlock
                                    text={aspectRatioScript.powerShell}
                                    language='powershell'
                                    showLineNumbers={true}
                                    theme={tomorrowNightBlue}
                                />
                            </React.Fragment>
                        }
                    />
                    <ShowHideContent
                        titleInitialState="Python"
                        titleOnClickStateTrue="Python"
                        titleOnClickStateFalse="Python (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>find_aspect_ratio.py</p>
                                <CodeBlock
                                    text={aspectRatioScript.python}
                                    language='python'
                                    showLineNumbers={true}
                                    theme={tomorrowNightEighties}
                                />
                            </React.Fragment>
                        }
                    />
                    <h3>SCCM Compliance Email Script</h3>
                    <ShowHideContent
                        titleInitialState="Main Run Script"
                        titleOnClickStateTrue="Main Run Script"
                        titleOnClickStateFalse="Main Run Script (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>Send-ComplianceEmailsAUTO.ps1</p>
                                <CodeBlock
                                    text={emailScript.SendComplianceEmailsAUTO}
                                    language='powershell'
                                    showLineNumbers={true}
                                    theme={tomorrowNightBlue}
                                />
                            </React.Fragment>
                        }
                    />
                    <ShowHideContent
                        titleInitialState="Run Excel Macro Script"
                        titleOnClickStateTrue="Run Excel Macro Script"
                        titleOnClickStateFalse="Run Excel Macro Script (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>Run-ExcelComplianceMacros.ps1</p>
                                <CodeBlock
                                    text={emailScript.RunExcelComplianceMacros}
                                    language='powershell'
                                    showLineNumbers={true}
                                    theme={tomorrowNightBlue}
                                />
                            </React.Fragment>
                        }
                    />
                    <ShowHideContent
                        titleInitialState="Send Compliance Emails Script"
                        titleOnClickStateTrue="Send Compliance Emails Script"
                        titleOnClickStateFalse="Send Compliance Emails Script (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>Send-ComplianceEmails.ps1</p>
                                <CodeBlock
                                    text={emailScript.SendComplianceEmails}
                                    language='powershell'
                                    showLineNumbers={true}
                                    theme={tomorrowNightBlue}
                                />
                            </React.Fragment>
                        }
                    />
                    <ShowHideContent
                        titleInitialState="Compliance VBA Macros"
                        titleOnClickStateTrue="Compliance VBA Macros"
                        titleOnClickStateFalse="Compliance VBA Macros (click to hide)"
                        showHideContentClass="Code-Block"
                        showHideContent={
                            <React.Fragment>
                                <p>ComplianceMacros.xlsm</p>
                                <CodeBlock
                                    text={emailScript.ComplianceMacros}
                                    language='vbnet'
                                    showLineNumbers={true}
                                    theme={tomorrowNightEighties}
                                />
                            </React.Fragment>
                        }
                    />
                </ul>
            </div>
        </div>
    );
}

export default Programming;
