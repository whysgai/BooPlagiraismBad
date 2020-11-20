import React from 'react';
import Submission from './types/Submission'
import { Link } from 'react-router-dom';
import {addSubmissionComparison} from './actions/ComparisonAction';
import { dispatchToPropertyMapper, stateToPropertyMapper } from './containers/SubmissionListContainer'

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
      <div className='ListItem'>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" 
          onClick={() => dispatchToPropertyMapper(addSubmissionComparison(this.props.submission))}/> 
        </div>
        <span>
          {this.props.submission.name}
        </span>
      </div>
    );
  }
}

export default SubmissionListItemComponent;