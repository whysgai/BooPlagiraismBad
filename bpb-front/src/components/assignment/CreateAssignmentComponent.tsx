import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../store';
import { createAssignment } from '../../actions/AssignmentAction';

/**
 * Constructor type interface to set the types of any properties in the constructor of the component.
 */
interface ConstructorType {
  name: string,
  uploaded: boolean
}

/**
 * Props type interface to set the types of any props that are passed from a parent component.
 */
interface PropsType {}

/**
 * This component holds the ability for a user to create an assignment by inputting a name and selecting the create
 * assignment button.
 */
class CreateAssignmentComponent extends React.Component <PropsType, ConstructorType> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: '',
          uploaded: false
        };
        this.onInputchange = this.onInputchange.bind(this);
  }

  /**
   * On input change sets and then binds (in the constructor) the text that has been entered into the assignment name field.
   * @param event the event by which the user is entering the assignment name
   */
  onInputchange(event : ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState((state) => {
      return {name: value}
    });   
  }

  /**
   * Call dispatch creates an assignment in store and sets uploaded to true so that the success button appears.
   */
  callDispatch() {
    store.dispatch(createAssignment('CREATE_ASSIGNMENT', this.state.name));
    this.setState((state) => {
      return {
        ...this.state,
        uploaded: true
      }
    })
  }

  /**
   * Assignment info is entered creates a check for whether a name has been entered for assignment.
   */
  assignmentInfoIsEntered() {
    if (this.state.name.length > 0) {
      return true
    }
    return false
  }

  render() {
    return (
        <div className="container card mt-3 assignment-creation">
          <div className="card-body">
            <div className="row col-12">
              <div className="col-11"><h3>Create Assignment</h3></div>
              <Link className="col-1 btn btn-outline-dark" to="/Assignments">
                <i className="fa fa-arrow-circle-left" aria-hidden="true"/> 
              </Link>
            </div>
          </div>
          <div className="col-12 text-center form-group">
              <label className="mr-2" htmlFor="assignment-name-input"><h5>Assignment Name:</h5></label>
              <input 
                id="assignment-name-input"
                name="name" 
                placeholder="name"
                className='assignment-name-input form-control' 
                type="text"
                disabled={this.state.uploaded} 
                onChange={this.onInputchange}
              />
              {
                !this.assignmentInfoIsEntered() &&
                <Link className='col-12 create-assignment-btn-disabled btn btn-outline-secondary disabled mt-2'
                    to="#"
                    onClick={(event) => event.preventDefault()}>
                    Create Assignment
                </Link>
              }
              {
                (this.assignmentInfoIsEntered() && !this.state.uploaded) &&
                <Link className='col-12 create-assignment-btn btn btn-success mt-2'
                    to="#"
                    onClick={(event) => {event.preventDefault(); this.callDispatch()}}>
                    Create Assignment
                </Link>
              }
              {
                (this.assignmentInfoIsEntered() && this.state.uploaded) &&
                <Link className='col-12 create-assignment-btn btn btn-outline-info mt-2'
                    to="/">
                    Success! Return to Assignments
                </Link>
              }
          </div>
        </div>
    );
}
}

export default CreateAssignmentComponent;