import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface PropTypes extends RouteComponentProps {}

/**
 * The help component consists of a basic render page where a user can see descriptions of how to create a submission
 * and an assignment as well as how to compare two submissions.
 */
class HelpComponent extends React.Component <PropTypes, {}> {

  constructor(props : PropTypes) {
    super(props);
  }

  render() {
    return (
      <div className="container card help-panel mt-3">
        <div className="card-body">
          <h2>Help / How-To</h2>
          <ul className="list-group">

            <li className="list-group-item">  
              <h4>Create an Assignment</h4>
              <ol>
                <li>Go to <Link to="/">Assignments</Link></li>
                <li>Choose Create New Assignment</li>
                <li>Enter a name for your assignment</li>
                <li>Choose Create Assignment</li>
                <li>Bang! An assignment is created!</li>
              </ol>
            </li>

            <li className="list-group-item">
              <h4>Make a Submission to an Assignment</h4>
              <ol>
                <li>Go to <Link to="/">Assignments</Link></li>
                <li>Choose the Assignment you are submitting to</li>
                <li>Select Upload Submission</li>
                <li>Choose files to submit by dropping them into the upload area</li>
                <li>Select Upload Submission</li>
                <li>Yes! Your submission is created! (hopefully)</li>
              </ol>
            </li>

            <li className="list-group-item">
              <h4>Compare Submissions</h4>
              <ol>
                <li>Go to <Link to="/">Assignments</Link></li>
                <li>Choose the Assignment you wish to view</li>
                <li>Choose the Submissions you wish to compare</li>
                <li>Select Compare Submissions</li>
                <li>In the Comparison view, select any file you wish to view from either submission</li>
                <li>Review the Similarity Percentage to see if the files shown are suspiciously similar...</li>
                <li>Select any Match you wish to view in more detail!</li>
              </ol>
            </li>

          </ul>
        </div>
      </div>
    );
  }
}

export default HelpComponent;