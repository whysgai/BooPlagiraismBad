import React from 'react';
import './AssignmentListComponent.css';
import AssignmentListCard from './AssignmentListCard'
import {Link} from 'react-router-dom'

function AssignmentListComponent({assignments}) {
  return (
    <div className='assignment-list'>
      <Link to="#" className="new-assignment-btn">new</Link>
      <ul>
        {
          assignments.map((assignment,index) => 
              <li><AssignmentListCard assignment={assignment}/></li>
           )
        }
      </ul>
    </div>
  );
}

export default AssignmentListComponent
