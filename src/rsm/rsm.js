import React, { useState } from 'react';
import '../App.css';
import './rsm.css';
import resumePdf from './daniel christianson resume 2023-07-22.pdf';

function ShowHideButton(){
    const [buttonState, setButtonState] = useState(false);
    const [buttonTitle, setButtonTitle] = useState("View");
    function onClickFunction(){
        if(buttonState === true){
            setButtonState(false);
            setButtonTitle("View");
        } else {
            setButtonState(true);
            setButtonTitle("Hide");
        }
    }
    return (
        <div>
            <button className="Show-Hide-Button" onClick={onClickFunction}>
                {buttonTitle}
            </button>
            {buttonState ? <HiddenContent /> : null}
        </div>
    );
}

// custom func for an iframe container to show/hide PDF
function IFrame(props){
    return(
        <div>
            <iframe className="Resume-Iframe" name={props.name} src={props.src} title="Resume" />
        </div>
    );
}

function HiddenContent(){
    return(
        <div>
            <IFrame name="resume" src={resumePdf}/>
        </div>
    );
}

function Resume() {
    return(
        <div className="Content-Div">
            <div className="Title-Header">
                <h1>Daniel Christianson</h1>
            </div>
            <div className="Content-Header">
                <h1>Resume</h1>
            </div>
            <a className="Resume-Download-Link" href={resumePdf} download>Direct Download</a>
            <ShowHideButton />
        </div>
    );
}
//style={{ display: state ? "block" : "none" }}
export default Resume;
