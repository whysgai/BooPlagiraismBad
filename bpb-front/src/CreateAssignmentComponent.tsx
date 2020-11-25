import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from './store';
import { createAssignment } from './actions/AssignmentAction';

interface PropsType {
  name: string
}

class CreateAssignmentComponent extends React.Component <PropsType, {}> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: this.props.name
        };
        this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event : ChangeEvent<HTMLInputElement>) {
    this.setState({
        [event.target.name]: event.target.value,
    });
  }

  callDispatch() {
    store.dispatch(createAssignment('ADD_ASSIGNMENT', this.props.name));
  }

  render() {
    return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <div style={{textAlign: 'right', paddingRight: '100px', paddingTop: '30px', fontWeight: 'bolder'}}>
                <Link className="btn btn-outline-danger mt-2" to="/">
                  x 
                </Link>
            </div>
            <h3>Create Assignment</h3>
            <br/>
            <span text-align="center">
                <h5>Assignment Name:</h5>
                <input name="name" className='assignment-name-input' type="text" value={this.props.name} onChange={this.onInputchange}/>
                <br/>
                <Link className='create-assignment-btn btn btn-outline-success mt-2'
                    to="/"
                    onClick={() => this.callDispatch()}>
                    Create Assignment
                </Link>
            </span>
        </div>
    );
}
}

export default CreateAssignmentComponent;