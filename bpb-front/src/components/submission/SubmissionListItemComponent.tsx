import React from 'react';
import Submission from '../../types/Submission'
import {addSubmissionComparison, removeSubmissionComparison} from '../../actions/ComparisonAction';
import {store} from '../../store'
import { removeSubmission } from '../../actions/SubmissionAction';

/**
 * Props type interface to set the types of any props that are passed from a parent component.
 */
interface PropsType {
  submission: Submission
  createSubmission: (arg: String) => void
  checkboxOn: boolean
}

/**
 * The submission list item component renders a single submission. It allows a user to select that submission to be compared
 * against another submission list item, along with allowing them to delete the submission.
 */
class SubmissionListItemComponent extends React.Component <PropsType, {}> {
  
  constructor(props : PropsType) {
    super(props);
    this.state = {
      submission : this.props.submission,
      checkboxOn: this.props.checkboxOn
    };
  }

  /**
   * Submission is already selected determines whether or not to disable the checkbox based on if the submission list item
   * has been added to the compare submissions array in store.
   */
  submissionAlreadySelected() {
    return store.getState().ComparisonReducer.compareSubmissions.filter(
      (submission : Submission) =>
        submission === this.props.submission
    ).length === 1
  }

  /**
   * Checkbox changes the state of a checkbox to true or false based on whether a submission has been selected for comparison.
   */
  checkbox() {
    if(this.submissionAlreadySelected()){
      store.dispatch(removeSubmissionComparison(this.props.submission))
      this.setState({
        checkboxOn: false
      })
    } else {
      store.dispatch(addSubmissionComparison(this.props.submission))
      this.setState({
        checkboxOn: true
      })
    }
  }

  /**
   * Delete a submission from the submission list.
   */
  deleteSubmission() {
    store.dispatch(removeSubmission(this.props.submission))
  }

  render() {
    return (
      <div className='submission-list-item col-12'>
        <input type="checkbox" className="form-check-input" id={`${this.props.submission._id}`}
        disabled={(!this.submissionAlreadySelected() && store.getState().ComparisonReducer.compareSubmissions.length >= 2)} 
        onClick={() => this.checkbox()}/>
        <label className="ml-4" htmlFor={`${this.props.submission._id}`}>
          <h5>{this.props.submission.name}</h5>
        </label>
        <button className='btn btn-outline-danger float-right' onClick={() => {this.deleteSubmission(); window.location.reload()}}><i className="fa fa-trash" aria-hidden="true"/></button>
      </div>
    );
  }
}

export default SubmissionListItemComponent;