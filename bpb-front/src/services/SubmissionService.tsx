import Assignment from "../types/Assignment"
import Submission from "../types/Submission"

const vagrantURL = 'http://192.168.33.10:8080/'


export function postSubmission(name : string, assignment: Assignment, files: string[]) : void {
    fetch(`${vagrantURL}submissions`, {
        method: 'POST',
        body: JSON.stringify({"name": name, "assignment_id": assignment._id}),
        headers: {'content-type': 'application/json'}
    }).then(response => response.json()).then(newSubmission => postFiles(newSubmission, files))
}

export function postFiles(submission: Submission, files: string[]) : void { 
    for (let file in files) {
        //convert string to formData
        let formData = new FormData();
        formData.append("submissionFile", files[file]);
        fetch(`${vagrantURL}submissions/${submission._id}/files`, {
            method: 'POST',
            body: formData
        })
    }
}

export async function getSubmissionIds(assignment : Assignment) : Promise<String[]> {
    let response = await fetch(`${vagrantURL}submissions/ofAssignment/${assignment._id}`);
    let asJson = await response.json();
    return Promise.resolve(asJson.submissionIds as String[]);
}

export async function getSubmission(submissionId : String) : Promise<Submission> {
    let response = await fetch(`${vagrantURL}submissions/${submissionId}`);
    let asJson = await response.json();
    console.log('getSubmission asJson', asJson)
    return Promise.resolve(asJson as Submission)
}

export default {postSubmission, postFile: postFiles, getSubmissionIds}