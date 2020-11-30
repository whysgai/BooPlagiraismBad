import Submission from '../types/Submission'
import { getComparison } from '../services/ComparisonService'

export function compareSubmissions(compareSubmissions : Submission[]) {
    return {
        type: 'COMPARE',
        compareSubmissions: compareSubmissions,
        comparison: getComparison(compareSubmissions)
    }
};

export function addSubmissionComparison(submission : Submission) {
    return {
        type: 'ADD_COMPARE',
        addSubmission: submission,
    }
}

export function removeSubmissionComparison(submission : Submission) {
    return {
        type: 'REMOVE_COMPARE',
        removeSubmission: submission,
    }
}