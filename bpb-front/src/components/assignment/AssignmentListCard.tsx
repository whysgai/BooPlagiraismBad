import React from 'react';
import Assignment from '../../types/Assignment'
import { Link } from 'react-router-dom';
import { store } from '../../store';
import {setCurrentAssignment, removeAssignment} from '../../actions/AssignmentAction'

/**
 * Props type interface to set the types of any props that are passed from a parent component.
 */
interface PropsType {
  assignment: Assignment
  createAssignment: (arg: String) => void 
}

/**
 * The assignment list card component renders a card that contains an individual assignment name. It also creates
 * the ability for a user to delete an assignment.
 */
class AssignmentListCard extends React.Component <PropsType,{}> {

  constructor(props : PropsType) {
    super(props)
  }
  
  /**
   * Set assignment pushes the selected assignment to the redux store.
   */
  setAssignment() {
    store.dispatch(setCurrentAssignment('SET_CURRENT_ASSIGNMENT', this.props.assignment))
  }

  /**
   * Delete assignment sends the assignment to the removeAssignment action where it can be removed from the
   * assignment list and from the server.
   */
  deleteAssignment() {
    store.dispatch(removeAssignment(this.props.assignment))
  }
  
  render() {
    return (
      <div className="assignment-list-card card">
        <Link to={`/Assignments/${this.props.assignment._id}/Submissions`} className='card-body' onClick={() => this.setAssignment()}>
          <span className='card-title'>
            {this.props.assignment.name}
          </span>
        </Link>
        <button className='btn btn-outline-danger ml-2' onClick={() => {this.deleteAssignment(); window.location.reload()}}>delete</button>
      </div>
    );
  }
}

export default AssignmentListCard;
