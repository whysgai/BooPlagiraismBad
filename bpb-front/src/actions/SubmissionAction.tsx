import Submission from '../types/Submission'

export default function submissionAction(submission : Submission) {
    return {
        type: 'ADD_COMPARE',
        submission: submission,
    }
};