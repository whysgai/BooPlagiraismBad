import React from 'react';
import Submission from '../../types/Submission'
import {addSubmissionComparison, removeSubmissionComparison} from '../../actions/ComparisonAction';
import {store} from '../../store'
import { removeSubmission } from '../../actions/SubmissionAction';

interface PropsType {
  submission: Submission
  createSubmission: (arg: String) => void
  checkboxOn: boolean
}

//({submission, createSubmission}:{submission : Submission, createSubmission: (arg: String) => void })

class SubmissionListItemComponent extends React.Component <PropsType, {}> {
  
  constructor(props : PropsType) {
    super(props);
    this.state = {
      submission : this.props.submission,
      checkboxOn: this.props.checkboxOn
    };
  }

  submissionAlreadySelected() {
    return store.getState().ComparisonReducer.compareSubmissions.filter(
      (submission : Submission) =>
        submission === this.props.submission
    ).length === 1
  }

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

  deleteSubmission() {
    store.dispatch(removeSubmission(this.props.submission))
  }

  render() {
    return (
      <div className='submission-list-item'>
        <div>
          <input type="checkbox" className="form-check-input" id="exampleCheck1"
          disabled={(!this.submissionAlreadySelected() && store.getState().ComparisonReducer.compareSubmissions.length >= 2)} 
          onClick={() => this.checkbox()} />
        </div>
        <span>
          {this.props.submission.name}
        </span>
        <br/>
        <button onClick={() => this.deleteSubmission()}>delete</button>
      </div>
    );
  }
}

export default SubmissionListItemComponent;