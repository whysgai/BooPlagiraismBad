import React from 'react';
import Assignment from '../../types/Assignment'
import { Link } from 'react-router-dom';
import { store } from '../../store';
import {setCurrentAssignment} from '../../actions/AssignmentAction'

interface PropsType {
  assignment: Assignment
  createAssignment: (arg: String) => void 
}

class AssignmentListCard extends React.Component <PropsType,{}> {

  constructor(props : PropsType) {
    super(props)
    // this.state = {
    //   assignment: this.props.assignment
    // }
  }
  
  setAssignment() {
    store.dispatch(setCurrentAssignment('SET_CURRENT_ASSIGNMENT', this.props.assignment))
  }
  
  render() {
    return (
      <div className="assignment-list-card card">
        <Link to={`/Assignments/${this.props.assignment._id}/Submissions`} className='card-body' onClick={() => this.setAssignment()}>
          <span className='card-title'>
            {this.props.assignment.name}
          </span>
        </Link>
      </div>
    );
  }
}

export default AssignmentListCard;
