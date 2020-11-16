import React from 'react';
import Assignment from './types/Assignment'

function AssignmentListCard({assignment, createAssignment}:{assignment : Assignment, createAssignment: (arg: String) => void }) {
  return (
    <div className="assignment-list-card">
      {assignment.title}
    </div>
  );
}

export default AssignmentListCard;
