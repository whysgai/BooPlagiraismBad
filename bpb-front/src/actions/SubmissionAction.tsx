import Assignment from '../types/Assignment'

export default function createSubmission(type : string, name : string, assignment : Assignment, files : JSON[]) {
    return {
        type: 'ADD_SUBMISSION',
        name: name,
        assignment: assignment,
        files: files,
        newSubmission:
    }
};