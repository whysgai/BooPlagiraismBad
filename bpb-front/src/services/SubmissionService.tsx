import Assignment from "../types/Assignment"

const assignmentURL = 'http://192.168.33.10:8080/'

export function postSubmission(name : string, assignment: Assignment, files: JSON[]) : void {
    fetch(`${assignmentURL}submissions`, {
        method: 'POST',
        body: JSON.stringify({"name": name, "assignment_id": assignment._id}),
        headers: {'content-type': 'application/json'}
    })
}

export function postFile(name : string, assignment: Assignment, files: JSON[]) : void {
    fetch(`${assignmentURL}submissions/${submission.submissionId}files`, {
        method: 'POST',
        body: JSON.stringify({"name": name, "assignment_id": assignment._id}),
        headers: {'content-type': 'application/json'}
    })
}

export default {postSubmission}