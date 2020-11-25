import React from 'react';
import Assignment from './types/Assignment'
import 'bootstrap/dist/css/bootstrap.min.css';

function AssignmentListCard({assignment, createAssignment}:{assignment : Assignment, createAssignment: (arg: String) => void }) {
  return (
    <div className="assignment-list-card">
      <span>
        {assignment.name}
      </span>
      <span className='pl-2'>
        Number of Submissions: {assignment.submissionIds.length}
      </span>
    </div>
  );
}

export default AssignmentListCard;
