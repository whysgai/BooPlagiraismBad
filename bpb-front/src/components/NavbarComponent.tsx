import React from 'react';
import { Link } from 'react-router-dom';

/**
 * The navbar creates an easy navigation system for a user so that they can select the help section or return
 * back to the assignments page.
 */
export default class NavbarComponent extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">BooPlagiarismBad</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/" id="AssignmentsLink">Assignments<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Help" id="HelpLink">Help</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}