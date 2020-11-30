import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from '../../types/Submission'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {store} from '../../store'
import { compareSubmissions } from '../../actions/ComparisonAction';

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

  requestComparison() {
    store.dispatch(compareSubmissions(store.getState().ComparisonReducer.compareSubmissions));
  }

  render() {
    return (
      <div className='submission-list' onClick={() => this.setDisabled()}>
        <h3>{store.getState().AssignmentReducer.currentAssignment.name}</h3>
        <Link className='btn btn-outline-success' to='/CreateSubmission'>Upload Submission</Link>
        <ul>
          {this.props.submissions.map((submission, index) => 
            <li key={index}><SubmissionListItemComponent checkboxOn={false} submission={submission} createSubmission={(arg: String) => null}/></li>
          )}
        </ul>

        {
          store.getState().ComparisonReducer.compareSubmissions.length === 0 &&
            <Link className='disabledCompareButton btn btn-outline-secondary disabled' to="/ComparisonComponent" id="zeroCompare" onClick={ (event) => event.preventDefault() }>
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        } 
        {
          store.getState().ComparisonReducer.compareSubmissions.length === 1 &&
            <Link className='disabledCompareButton btn btn-outline-secondary disabled' to="/ComparisonComponent" id="oneCompare" onClick={ (event) => event.preventDefault() }>
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
        { 
          store.getState().ComparisonReducer.compareSubmissions.length === 2 &&
            <Link className='enabledCompareButton btn btn-outline-success' to="/ComparisonComponent" id="twoCompare" onClick={() => this.requestComparison()}>
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
      </div>
    );
  }
}

export default SubmissionListComponent;