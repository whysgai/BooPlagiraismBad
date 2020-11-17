import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'

function SubmissionListComponent({submissions}: {submissions: Submission[]}) {
  return (
    <div>
      <ul>
        {submissions.map((submission, index) => 
          <li key={index}><SubmissionListItemComponent submission={submission} createSubmission={null}/></li>
        )}
      </ul>
    </div>
  );
}

export default SubmissionListComponent;