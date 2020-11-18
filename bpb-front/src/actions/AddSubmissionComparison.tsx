import Submission from '../types/Submission'

export default function addSubmissionComparison(addSubmission : Submission) {
    return {
        type: 'ADD_COMPARE',
        addSubmission: addSubmission,
    }
}