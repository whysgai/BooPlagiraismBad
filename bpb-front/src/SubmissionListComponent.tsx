import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from './types/Submission'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { stateToPropertyMapper } from './containers/SubmissionListContainer';
import SubmissionReducer from './reducers/SubmissionReducer';

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

  setDisabled() {
    if (stateToPropertyMapper(SubmissionReducer).submissionComparison.length === 2) {
      this.setState({
        isDisabled: true
      })
    }
  }

  render() {
    return (
      <div onClick={() => this.setDisabled()}>
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