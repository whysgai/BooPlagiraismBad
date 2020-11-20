import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from './types/Submission'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { stateToPropertyMapper } from './containers/SubmissionListContainer';
import SubmissionReducer from './reducers/SubmissionReducer';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        isDisabled: false
      })
    }
  }

  render() {
    return (
      <div className='submission-list' onClick={() => this.setDisabled()}>
        <h3>Assignment</h3>
        <Link to='/CreateSubmissionComponent'>Upload Submission</Link>
        <ul>
          {this.props.submissions.map((submission, index) => 
            <li key={index}><SubmissionListItemComponent submission={submission} createSubmission={null}/></li>
          )}
        </ul>
        { 
          this.props.isDisabled
          ? <Link to="/ComparisonComponent" className="enabledCompareButton">Compare Submissions 
          {stateToPropertyMapper(SubmissionReducer).submissionComparison.length}/2</Link>
          : <Link to="/ComparisonComponent" className="disabledCompareButton" onClick={ (event) => event.preventDefault() }>
          Compare Submissions {stateToPropertyMapper(SubmissionReducer).submissionComparison.length}/2</Link>
        }
      </div>
    );
  }
}

export default SubmissionListComponent;