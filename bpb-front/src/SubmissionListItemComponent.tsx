import React from 'react';
import Submission from './types/Submission'
import { Link } from 'react-router-dom';
import {addSubmissionComparison} from './actions/ComparisonAction';
import { dispatchToPropertyMapper, stateToPropertyMapper } from './containers/SubmissionListContainer'
import {store} from './store'

interface PropsType {
  submission: Submission
  createSubmission: (arg: String) => void
}

//({submission, createSubmission}:{submission : Submission, createSubmission: (arg: String) => void })

class SubmissionListItemComponent extends React.Component <PropsType, {}> {
  
  constructor(props) {
    super(props);
    this.state = {
      submission : this.props.submission,
    };
  }

  render() {
    return (
      <div className='submission-list-item'>
        <div>
          <input type="checkbox" className="form-check-input" id="exampleCheck1" 
          onClick={() => {store.dispatch(addSubmissionComparison(this.props.submission)); 
          console.log('component disabled check')}}/> 
        </div>
        <span>
          {this.props.submission.name}
        </span>
      </div>
    );
  }
}

export default SubmissionListItemComponent;