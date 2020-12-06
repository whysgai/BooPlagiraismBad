import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../store';
import { createAssignment } from '../../actions/AssignmentAction';

interface PropsType {

}

class CreateAssignmentComponent extends React.Component <PropsType, {name: string, uploaded: boolean}> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: '',
          uploaded: false
        };
        this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event : ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState((state) => {
      return {name: value}
    });   
  }

  callDispatch() {
    store.dispatch(createAssignment('CREATE_ASSIGNMENT', this.state.name));
    this.setState((state) => {
      return {
        ...this.state,
        uploaded: true
      }
    })
  }

  assignmentInfoIsEntered() {
    if (this.state.name.length > 0) {
      return true
    }
    return false
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
                <input 
                  name="name" 
                  className='assignment-name-input' 
                  type="text" 
                  onChange={this.onInputchange}
                />
                <br/>
                  {
                    !this.assignmentInfoIsEntered() &&
                    <Link className='create-assignment-btn btn btn-outline-secondary disabled mt-2'
                        to="#"
                        onClick={(event) => event.preventDefault()}>
                        Create Assignment
                    </Link>
                  }
                  {
                    (this.assignmentInfoIsEntered() && !this.state.uploaded) &&
                    <Link className='create-assignment-btn btn btn-outline-success mt-2'
                        to="#"
                        onClick={(event) => {event.preventDefault(); this.callDispatch()}}>
                        Create Assignment
                    </Link>
                  }
                  {
                    (this.assignmentInfoIsEntered() && this.state.uploaded) &&
                    <Link className='create-assignment-btn btn btn-outline-success mt-2'
                        to="/">
                        Success! Return to Assignments
                    </Link>
                  }
            </span>
        </div>
    );
}
}

export default CreateAssignmentComponent;