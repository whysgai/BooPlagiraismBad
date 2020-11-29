import React from 'react';
import './css/AssignmentListComponent.css';
import AssignmentListCard from './AssignmentListCard'
import Assignment from '../../types/Assignment'
import {Link} from 'react-router-dom'

interface PropsType {
  assignments:Assignment[]
}

class AssignmentListComponent extends React.Component <PropsType, {}> {
  //({assignments = [{_id:"01", name:"Mikayla", submissionIds:[]}]}: {assignments: Assignment[]})
  constructor(props: PropsType) {
    super(props);
    this.state = {
      assignments : []
    };
  }
  
  render () {
    return (        
      <div className='assignment-list pl-2'>
        <Link to="/CreateAssignment" className="new-assignment-btn btn btn-outline-info ml-2">Create New Assignment</Link>
        <ul className='nav'>
          {
            this.props.assignments.map((assignment,index) => 
                <li className='nav-item' key={index}><AssignmentListCard assignment={assignment} createAssignment={(arg: String) => null}/></li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default AssignmentListComponent
