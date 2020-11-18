import React from 'react';
import Submission from './types/SubmissionType'
import { Link } from 'react-router-dom';

function SubmissionListItemComponent({submission, createSubmission}:{submission : Submission, createSubmission: (arg: String) => void }) {
  return (
    <div>
      <Link>
        {submission.name}
      </Link>
    </div>
  );
}

export default SubmissionListItemComponent;