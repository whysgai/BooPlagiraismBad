import React from 'react';
import './AssignmentListComponent.css';
import AssignmentListCard from './AssignmentListCard'
import Assignment from './types/Assignment'
import {Link} from 'react-router-dom'

function AssignmentListComponent({assignments}: {assignments: Assignment[]}) {
  return (
    <div className='assignment-list'>
      <Link to="#" className="new-assignment-btn">new</Link>
      <ul>
        {
          assignments.map((assignment,index) => 
              <li key={index}><AssignmentListCard assignment={assignment} createAssignment={assignment}/></li>
           )
        }
      </ul>
    </div>
  );
}

export default AssignmentListComponent
