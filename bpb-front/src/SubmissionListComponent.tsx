import React from 'react';

function SubmissionListComponent({submissions}) {
  return (
    <div>
      <ul>
        {submissions.map((submission, index) => 
          <li key={index}> {submission} </li>
        )}
      </ul>
    </div>
  );
}

export default SubmissionListComponent;