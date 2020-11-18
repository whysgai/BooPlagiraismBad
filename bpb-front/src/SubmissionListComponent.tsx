import React from 'react';
import SubmissionListItemComponent from './SubmissionListItemComponent'
import Submission from './types/Submission'
import { Link } from 'react-router-dom';

function SubmissionListComponent({submissions}: {submissions: Submission[]}) {
  return (
    <div>
      <h3>Assignment</h3>
      <Link to='#'>Upload Submission</Link>
      <ul>
        {submissions.map((submission, index) => 
          <li key={index}><SubmissionListItemComponent submission={submission} createSubmission={null}/></li>
        )}
      </ul>
      <button>Compare Submissions</button>
    </div>
  );
}

export default SubmissionListComponent;