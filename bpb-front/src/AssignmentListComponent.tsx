import React, { ReactPropTypes } from 'react';
import './AssignmentListComponent.css';
import AssignmentListCard from './AssignmentListCard'
import Assignment from './types/Assignment'
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
      <div className='assignment-list'>
        <Link to="/CreateAssignment" className="new-assignment-btn">new</Link>
        <ul>
          {
            this.props.assignments.map((assignment,index) => 
                <li key={index}><AssignmentListCard assignment={assignment} createAssignment={(arg: String) => null}/></li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default AssignmentListComponent
