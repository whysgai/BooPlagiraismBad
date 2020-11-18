import React from 'react';
import Submission from './types/Submission'
import { Link } from 'react-router-dom';

function SubmissionListItemComponent({submission, createSubmission}:{submission : Submission, createSubmission: (arg: String) => void }) {
  return (
    <div>
      <button>Compare</button>
      <span>
        {submission.name}
      </span>
    </div>
  );
}

export default SubmissionListItemComponent;