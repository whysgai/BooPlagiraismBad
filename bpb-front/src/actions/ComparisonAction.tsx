import Submission from '../types/Submission'

export function compareSubmissions(compareSubmissions : Submission[]) {
    return {
        type: 'COMPARE',
        compareSubmissions: compareSubmissions,
    }
};

export function addSubmissionComparison(addSubmission : Submission) {
    return {
        type: 'ADD_COMPARE',
        addSubmission: addSubmission,
    }
}

export function removeSubmissionComparison(addSubmission : Submission) {
    return {
        type: 'REMOVE_COMPARE',
        addSubmission: addSubmission,
    }
}