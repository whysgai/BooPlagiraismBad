import Assignment from '../types/Assignment'
import Submission from '../types/Submission'
import { postSubmission, getSubmissionIds, getSubmission } from '../services/SubmissionService'

export function createSubmission(type : string, name : string, assignment : Assignment, files : File[]) {
    return {
        type: 'UPLOAD_SUBMISSION',
        name: name,
        assignment: assignment,
        files: files,
        newSubmission: postSubmission(name, assignment, files)
    }
};

export function readSubmissions(assignmentId : String) {
    return getSubmissionIds(assignmentId).then(async (submissionIds) => {
        let submissions = [] as Submission[]
        for (let submissionId of submissionIds) {
            submissions.push(await getSubmission(submissionId))
            //console.log('submissions so far', submissions)
        }
        return {
            type: 'READ_SUBMISSIONS',
            submissions: submissions
        }
    });
}