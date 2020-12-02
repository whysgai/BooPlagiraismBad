import Submission from '../types/Submission'
import { getComparison, getFileContent } from '../services/ComparisonService'

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

export function readFileContent(submissionId: String, subIndex: Number, fileIndex: Number) {
    return getFileContent(submissionId, fileIndex).then((fileContent) => {
        if(subIndex === 1) {
            return {
                type: 'GET_FILE_ONE',
                fileContent: fileContent
            }
        } else {
            return {
                type: 'GET_FILE_TWO',
                fileContent: fileContent
            }
        }
    })

}