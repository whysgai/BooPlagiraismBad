import Assignment from "../types/Assignment"
import Submission from "../types/Submission"

// the URL that is used for the server
const envURL = process.env.REACT_APP_BPB_SRVADDR

/**
 * The post submission function adds a submission to the server.
 * @param name the name of a submission
 * @param assignment the assignment to associate the submission to
 * @param files the files contained in a submission
 */
export function postSubmission(name : string, assignment: Assignment, files: File[]) : void {
    fetch(`${envURL}submissions`, {
        method: 'POST',
        body: JSON.stringify({"name": name, "assignment_id": assignment._id}),
        headers: {'content-type': 'application/json'}
    }).then(response => response.json()).then(newSubmission => postFiles(newSubmission, files))
}

/**
 * The deleteSubmission service deletes a submission from the server.
 * @param submissionId the submission that is being deleted from the server.
 */
export function deleteSubmission(submissionId: String) : void {
    fetch(`${envURL}submissions/${submissionId}`, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'}
    }).then(response =>
        response.json().then(json => {
          return json;
        }))
}

/**
 * The post files service adds files to an existing submission in the server.
 * @param submission a submission that the files will be associated with
 * @param files the files of a submission
 */
export function postFiles(submission: Submission, files: File[]) : void { 
    let file : File
    for (file of files) {
        //convert string to formData
        let formData = new FormData();
        formData.append("submissionFile", file);
        fetch(`${envURL}submissions/${submission._id}/files`, {
            method: 'POST',
            body: formData
        })
    }
}

/**
 * The get submission ids service pulls all submission ids associated with a particular assignment from the server.
 * @param assignmentId the assignment id that we are getting submissions from
 */
export async function getSubmissionIds(assignmentId : String) : Promise<String[]> {
    let response = await fetch(`${envURL}submissions/ofAssignment/${assignmentId}`);
    let asJson = await response.json();
    return Promise.resolve(asJson.submissionIds as String[]);
}

/**
 * The get submission service pulls a particular submissions information from the server using only the submission id.
 * This is mainly used when refreshing a comparison page.
 * @param submissionId the submission id of the submission to be pulled from the server.
 */
export async function getSubmission(submissionId : String) : Promise<Submission> {
    console.log("Getting submission from server with id", submissionId);
    let response = await fetch(`${envURL}submissions/${submissionId}`);
    let asJson = await response.json();
    console.log('getSubmission asJson', asJson)
    return Promise.resolve(asJson as Submission)
}

export default {postSubmission, postFile: postFiles, getSubmissionIds}