import React from 'react';
import './AssignmentListComponent.css';
import AssignmentListCard from './AssignmentListCard'

function AssignmentListComponent({assignments}) {
  return (
    <div className="App">
      <ul>
        {
          assignments.map((assignment,index) => {
              <li><AssignmentListCard assignment={assignment}/></li>
           })
        }
      </ul>
    </div>
  );
}
