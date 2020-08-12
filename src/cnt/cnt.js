import React from 'react';
import '../App.css';
import './cnt.css';

function Contact() {
    return(
        <div className="Content-Div">
            <div className="Content-Header">
                <h1>Contact</h1>
                <h2 style={{color: "#cc3333"}}>~ Under Construction ~</h2>
            </div>
            <div className="Contact-Div">
                <p>daniel.s.christianson@gmail.com</p>
                <div className="Contact-Form">
                    <form>
                        <div className="Contact-Form-Group">
                            <label>Name:</label>
                            <input className="Contact-Form-Input" type="text" /><br /><br />
                        </div>
                        <div className="Contact-Form-Group">
                            <label>Email:</label>
                            <input className="Contact-Form-Input" type="text" /><br /><br />
                        </div>
                        <div className="Contact-Form-Group">
                            <label>Subject:</label>
                            <input className="Contact-Form-Input" type="text" /><br /><br />
                        </div>
                        <div className="Contact-Form-Group">
                            <label>Message:</label>
                            <textarea className="Contact-Form-Input" /><br /><br />
                        </div>
                        <button disabled={true} className="Contact-Form-Button" type="submit">Temporarily Disabled</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
