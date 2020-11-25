import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from './types/Submission'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {store} from './store'

interface PropTypes {
  submissions: Submission[]
  compareEnabled: number
}

class SubmissionListComponent extends React.Component <PropTypes, {}> {

  constructor(props : PropTypes) {
    super(props);
    this.state = {
      submissions : [],
      compareEnabled: 0
    };
  }

  setDisabled() {
    if (store.getState().ComparisonReducer.compareSubmissions.length <= 2) {
      let newNum = this.props.compareEnabled + 1
      this.setState({
        compareEnabled: newNum
      })
    } 
  }

  render() {
    return (
      <div className='submission-list' onClick={() => this.setDisabled()}>
        <h3>Assignment</h3>
        <Link to='/CreateSubmissionComponent'>Upload Submission</Link>
        <ul>
          {this.props.submissions.map((submission, index) => 
            <li key={index}><SubmissionListItemComponent checkboxOn={false} submission={submission} createSubmission={(arg: String) => null}/></li>
          )}
        </ul>

        {
          store.getState().ComparisonReducer.compareSubmissions.length === 0 &&
            <Link to="/ComparisonComponent" id="zeroCompare" className="disabledCompareButton" onClick={ (event) => event.preventDefault() }>
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        } 
        {
          store.getState().ComparisonReducer.compareSubmissions.length === 1 &&
            <Link to="/ComparisonComponent" id="oneCompare" className="disabledCompareButton" onClick={ (event) => event.preventDefault() }>
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
        { 
          store.getState().ComparisonReducer.compareSubmissions.length === 2 &&
            <Link to="/ComparisonComponent" id="twoCompare" className="enabledCompareButton">
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
      </div>
    );
  }
}

export default SubmissionListComponent;