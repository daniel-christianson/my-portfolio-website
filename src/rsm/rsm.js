import React from 'react';
import '../App.css';
import resumePdf from './daniel christianson resume 2020-07-30.pdf';

function IFrame(props){
    return(
        <div>
            <iframe className="Resume-Iframe" name={props.name} src={props.src} /*height={props.height} width={props.width}*/ />
        </div>
    );
}

function Resume() {
    return(
        <div className="Content-div">
            <a href={resumePdf}>Direct Download</a>
            <br /><br />
            <IFrame name="resume" src={resumePdf} />
        </div>
    );
}

export default Resume;
