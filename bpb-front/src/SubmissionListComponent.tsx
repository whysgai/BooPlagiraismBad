import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from './types/Submission'
import { Link } from 'react-router-dom';

interface PropsType {
  submissions: Submission[]
  isDisabled: boolean
}

class SubmissionListComponent extends React.Component <PropsType, {}> {

  constructor(props) {
    super(props);
    this.state = {
      submissions : [],
      isDisabled: true
    };
  }


  render() {
    return (
      <div>
        <h3>Assignment</h3>
        <Link to='./CreateSubmissionComponent'>Upload Submission</Link>
        <ul>
          {this.props.submissions.map((submission, index) => 
            <li key={index}><SubmissionListItemComponent submission={submission} createSubmission={null}/></li>
          )}
        </ul>
        <button disabled={this.props.isDisabled} onClick={() => 
          this.setState({isDisabled: true })}>Compare Submissions</button>
      </div>
    );
  }
}

export default SubmissionListComponent;