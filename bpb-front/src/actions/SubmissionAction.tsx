import Assignment from '../types/Assignment'
import { postSubmission } from '../services/SubmissionService'

export default function createSubmission(type : string, name : string, assignment : Assignment, files : string[]) {
    return {
        type: 'UPLOAD_SUBMISSION',
        name: name,
        assignment: assignment,
        files: files,
        newAssignment: postSubmission(name, assignment, files)
    }
};