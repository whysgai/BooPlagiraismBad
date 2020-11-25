import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from './store';
import createSubmission from './actions/SubmissionAction';
import Assignment from './types/Assignment';
//import { createSubmission } from './actions/SubmissionAction';

interface PropsType {
  name: string
  assignment : Assignment
  files : JSON[]
}

class CreateSubmissionComponent extends React.Component <PropsType, {}> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: this.props.name,
          assignment : this.props.assignment,
          files : this.props.files
        };
        this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event : ChangeEvent<HTMLInputElement>) {
    this.setState({
        [event.target.name]: event.target.value,
    });
  }

  callDispatch() {
    store.dispatch(createSubmission('ADD_SUBMISSION', this.props.name, this.props.assignment, this.props.files));
  }

  render() {
    return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <div style={{textAlign: 'right', paddingRight: '100px', paddingTop: '30px', fontWeight: 'bolder'}}>
                <Link className="btn btn-outline-danger mt-2" to="/">
                  x 
                </Link>
            </div>
            <h3>Upload Submission to Assignment {store.getState().AssignmentAction.assignment}</h3>
            <br/>
            <span text-align="center">
                <h5>Submission Name:</h5>
                <input name="name" className='assignment-name-input' type="text" value={this.props.name} onChange={this.onInputchange}/>
                <br/>
                <Link className='create-assignment-btn btn btn-outline-success mt-2'
                    to="/"
                    onClick={() => this.callDispatch()}>
                    Upload Submission
                </Link>
            </span>
        </div>
    );
}
}

export default CreateSubmissionComponent;