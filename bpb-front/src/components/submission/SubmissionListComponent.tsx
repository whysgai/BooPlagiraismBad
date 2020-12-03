import React from 'react';
import { RouteComponentProps } from 'react-router';
import SubmissionListItemComponent from './SubmissionListItemComponent';
import Submission from '../../types/Submission';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {store} from '../../store';
import { compareSubmissions } from '../../actions/ComparisonAction';
import { readSubmissions } from '../../actions/SubmissionAction';
import { Match } from '@testing-library/react';
import { setCurrentAssignment, setCurrentAssignmentFromId } from '../../actions/AssignmentAction';

interface MatchParams {
  assignmentId: string,
}

interface PropTypes extends RouteComponentProps<MatchParams> {

}

class SubmissionListComponent extends React.Component <PropTypes, {submissions: Submission[], compareEnabled: number}> {

  constructor(props : PropTypes) {
    super(props);
    this.state = {
      submissions : store.getState().SubmissionReducer.submissions,
      compareEnabled: 0
    };
  }

  componentDidMount() {
    const assignmentId = this.props.match.params.assignmentId
    console.log("submission list URL id", assignmentId)
    setCurrentAssignmentFromId('SET_CURRENT_ASSIGNMENT', assignmentId)
      .then((assignmentAction) => store.dispatch(assignmentAction))
    readSubmissions(assignmentId)
      .then((submissionAction) => store.dispatch(submissionAction))
      .then(() => {
        this.setState({
          submissions : store.getState().SubmissionReducer.submissions
        })
      })
  }

  setDisabled() {
    if (store.getState().ComparisonReducer.compareSubmissions.length <= 2) {
      let newNum = this.state.compareEnabled + 1
      this.setState({
        compareEnabled: newNum
      })
    } 
  }

  requestComparison() {
    //store.dispatch(compareSubmissions(store.getState().ComparisonReducer.compareSubmissions));
  }

  render() {
    return (
      <div className='submission-list' onClick={() => this.setDisabled()}>
        <h3>{store.getState().AssignmentReducer.currentAssignment.name}</h3>
        <div>
          <div className="col-10"></div>
          <div className="col-2 float-right">
                <Link className="btn btn-outline-danger mt-2" to={`/`}>
                  Back 
                </Link>
            </div>
        </div>
        <Link className='btn btn-outline-success' to={`/Assignments/${this.props.match.params.assignmentId}/CreateSubmission`}>Upload Submission</Link>
        {
          this.state.submissions.length > 0 &&
            <ul>
              {this.state.submissions.map((submission, index) => 
                <li key={index}><SubmissionListItemComponent checkboxOn={false} submission={submission} createSubmission={(arg: String) => null}/></li>
              )}
            </ul>
        }
        {
          this.state.submissions.length <= 0 &&
            <h5>No Submissions Exist for this Assignment</h5>
        }
        

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
            <Link className='enabledCompareButton btn btn-outline-success'
              to={
                `/Assignments/${this.props.match.params.assignmentId}/CompareSubmissions/${store.getState().ComparisonReducer.compareSubmissions[0]._id}/${store.getState().ComparisonReducer.compareSubmissions[1]._id}`
              }
              id="twoCompare" onClick={() => this.requestComparison()}
              >
              Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
      </div>
    );
  }
}

export default SubmissionListComponent;