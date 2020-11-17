import React from 'react';

function SubmissionListItemComponent({submission, createSubmission}:{submission : Submission, createSubmission: (arg: String) => void }) {
  return (
    <div>
        {submission.name}
    </div>
  );
}

export default SubmissionListItemComponent;