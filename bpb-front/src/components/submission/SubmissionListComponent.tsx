import React from 'react';
import { RouteComponentProps } from 'react-router';
import SubmissionListItemComponent from './SubmissionListItemComponent';
import Submission from '../../types/Submission';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {store} from '../../store';
import { clearComparisonSubmissions, compareSubmissions } from '../../actions/ComparisonAction';
import { readSubmissions } from '../../actions/SubmissionAction';
import { Match } from '@testing-library/react';
import { setCurrentAssignment, setCurrentAssignmentFromId } from '../../actions/AssignmentAction';

interface ConstructorTypes {
  submissions: Submission[], 
  compareEnabled: number, 
  retrievedFromServer: boolean
}

interface MatchParams {
  assignmentId: string,
}

interface PropTypes extends RouteComponentProps<MatchParams> {

}

class SubmissionListComponent extends React.Component <PropTypes, ConstructorTypes> {

  constructor(props : PropTypes) {
    super(props);
    this.state = {
      submissions : store.getState().SubmissionReducer.submissions,
      compareEnabled: 0,
      retrievedFromServer: false
    };
  }

  componentDidMount() {
    // Clear the store of lingering compareSubmissions values
    store.dispatch(clearComparisonSubmissions());
    // Now set the current assignment from the URL param
    const assignmentId = this.props.match.params.assignmentId
    setCurrentAssignmentFromId('SET_CURRENT_ASSIGNMENT', assignmentId)
      .then((assignmentAction) => store.dispatch(assignmentAction))
    // Finally, fetch associated submissions based on URL param  
    readSubmissions(assignmentId)
      .then((submissionAction) => store.dispatch(submissionAction))
      .then(() => {
        this.setState((state) => {
          return {
            ...this.state,
            submissions : store.getState().SubmissionReducer.submissions,
            retrievedFromServer: true
          }
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

  render() {
    return (
      <div className="container card">
        <div className="card-body">
          <div className='submission-list' onClick={() => this.setDisabled()}>          
            <div className="row">
              <div className="col-11">
                <h3 className="card-title">{store.getState().AssignmentReducer.currentAssignment.name}</h3>
              </div>
              <div className="col-1 float-right">
                    <Link className="btn btn-outline-dark mt-2" to={`/`}>
                      <i className="fa fa-arrow-circle-left" aria-hidden="true"/> 
                    </Link>
                </div>
            </div>
            <Link className='btn btn-outline-info col-12 mt-2 mb-2' to={`/Assignments/${this.props.match.params.assignmentId}/CreateSubmission`}>Upload Submission</Link>
            {
              (!this.state.retrievedFromServer)  &&
                <h5>Fetching submissions from server...</h5>
            }
            {
              (this.state.submissions.length > 0 && this.state.retrievedFromServer) &&
                <ul className="list-group">
                  {this.state.submissions.map((submission, index) => 
                    <li key={index} className="list-group-item"><SubmissionListItemComponent checkboxOn={false} submission={submission} createSubmission={(arg: String) => null}/></li>
                  )}
                </ul>
            }
            {
              (this.state.submissions.length <= 0  && this.state.retrievedFromServer)  &&
                <h5>No Submissions Exist for this Assignment</h5>
            }
            {
              (store.getState().ComparisonReducer.compareSubmissions.length === 0 || store.getState().ComparisonReducer.compareSubmissions.length === 1) &&
                <Link className='disabledCompareButton btn btn-outline-secondary disabled col-12 mt-2 mb-2' to="/ComparisonComponent" id="zeroCompare" onClick={ (event) => event.preventDefault() }>
                  Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
                </Link>
            } 
            { 
              store.getState().ComparisonReducer.compareSubmissions.length === 2 &&
                <Link className='enabledCompareButton btn btn-success col-12 mt-2 mb-2'
                  to={
                    `/Assignments/${this.props.match.params.assignmentId}/CompareSubmissions/${store.getState().ComparisonReducer.compareSubmissions[0]._id}/${store.getState().ComparisonReducer.compareSubmissions[1]._id}`
                  }
                  id="twoCompare" 
                  >
                  Compare Submissions {store.getState().ComparisonReducer.compareSubmissions.length}/2
                </Link>
            }
          </div>
        </div>  
      </div>
    );
  }
}

export default SubmissionListComponent;