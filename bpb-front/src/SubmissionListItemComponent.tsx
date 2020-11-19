import React from 'react';
import Submission from './types/Submission'
import { Link } from 'react-router-dom';
import {addSubmissionComparison} from './actions/ComparisonAction';
import { dispatchToPropertyMapper, stateToPropertyMapper } from './containers/SubmissionListContainer'

function SubmissionListItemComponent({submission, createSubmission}:{submission : Submission, createSubmission: (arg: String) => void }) {
  return (
    <div className='ListItem'>
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="exampleCheck1" 
        onClick={() => dispatchToPropertyMapper(addSubmissionComparison(submission))}/> 
      </div>
      <span>
        {submission.name}
      </span>
    </div>
  );
}

export default SubmissionListItemComponent;