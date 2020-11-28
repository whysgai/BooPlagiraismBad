import Assignment from "../types/Assignment"
import Submission from "../types/Submission"

const vagrantURL = 'http://192.168.33.10:8080/'
const formData = new FormData()

export function postSubmission(name : string, assignment: Assignment, files: JSON[]) : void {
    fetch(`${vagrantURL}submissions`, {
        method: 'POST',
        body: JSON.stringify({"name": name, "assignment_id": assignment._id}),
        headers: {'content-type': 'application/json'}
    }).then(response => response.json()).then(newSubmission => postFile(newSubmission, files))
}

export function postFile(submission: Submission, files: JSON[]) : void {
    for (let file in files) {
        fetch(`${vagrantURL}submissions/${submission._id}files`, {
            method: 'POST',
            body: formData,
        })
    }
}

export default {postSubmission, postFile}