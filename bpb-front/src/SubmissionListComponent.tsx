import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from './types/Submission'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { stateToPropertyMapper } from './containers/SubmissionListContainer';
import SubmissionReducer from './reducers/SubmissionReducer';
import 'bootstrap/dist/css/bootstrap.min.css';
import ComparisonReducer from './reducers/ComparisonReducer';
import {store} from './store'
import { Store } from 'redux';

interface PropTypes {
  submissions: Submission[]
  compareEnabled: number
  store: Store
}

class SubmissionListComponent extends React.Component <PropTypes, {}> {

  constructor(props : PropTypes) {
    super(props);
    this.state = {
      submissions : [],
      compareEnabled: 0
    };
  }

  setDisabled() {
    if (store.getState().ComparisonReducer.compareSubmissions.length <= 2) {
      let newNum = this.props.compareEnabled + 1
      this.setState({
        compareEnabled: newNum
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
            <li key={index}><SubmissionListItemComponent store={store} checkboxOn={false} submission={submission} createSubmission={(arg: String) => null}/></li>
          )}
        </ul>

        {
          this.props.store.getState().ComparisonReducer.compareSubmissions.length === 0 &&
            <Link to="/ComparisonComponent" id="zeroCompare" className="disabledCompareButton" onClick={ (event) => event.preventDefault() }>
              Compare Submissions {this.props.store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        } 
        {
          this.props.store.getState().ComparisonReducer.compareSubmissions.length === 1 &&
            <Link to="/ComparisonComponent" id="oneCompare" className="disabledCompareButton" onClick={ (event) => event.preventDefault() }>
              Compare Submissions {this.props.store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
        { 
          this.props.store.getState().ComparisonReducer.compareSubmissions.length === 2 &&
            <Link to="/ComparisonComponent" id="twoCompare" className="enabledCompareButton">
              Compare Submissions {this.props.store.getState().ComparisonReducer.compareSubmissions.length}/2
            </Link>
        }
      </div>
    );
  }
}

export default SubmissionListComponent;