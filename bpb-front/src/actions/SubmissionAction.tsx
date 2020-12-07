import Assignment from '../types/Assignment'
import Submission from '../types/Submission'
import { postSubmission, getSubmissionIds, getSubmission, deleteSubmission } from '../services/SubmissionService'

/**
 * The create submission action sends files and a submission name to the server to be registered under an assignment.
 * @param type the type is passed to the reducer to determine which action has been taken.
 * @param name the name that a user inputs for a submission.
 * @param assignment the assignment a user is adding the submission to.
 * @param files the files that are added for the submission.
 */
export function createSubmission(type : string, name : string, assignment : Assignment, files : File[]) {
    return {
        type: 'UPLOAD_SUBMISSION',
        name: name,
        assignment: assignment,
        files: files,
        newSubmission: postSubmission(name, assignment, files)
    }
};

/**
 * The read submissions action employs the getSubmissionIds() service to get all submissions of a particular 
 * assignment and set this list in store.
 * @param assignmentId the assignment whose submissions are being called from the backend.
 */
export function readSubmissions(assignmentId : String) {
    return getSubmissionIds(assignmentId).then(async (submissionIds) => {
        let submissions = [] as Submission[]
        for (let submissionId of submissionIds) {
            submissions.push(await getSubmission(submissionId));
        }
        return {
            type: 'READ_SUBMISSIONS',
            submissions: submissions
        }
    });
}

/**
 * The remove submission action employs the deleteSubmission() service to remove a submission from the server.
 * @param removeSubmission the submission to be deleted from the server.
 */
export function removeSubmission(removeSubmission: Submission) : any {
    deleteSubmission(removeSubmission._id)
    return {
        type: 'DELETE_SUBMISSION',
        removeSubmission: removeSubmission,
    }
};