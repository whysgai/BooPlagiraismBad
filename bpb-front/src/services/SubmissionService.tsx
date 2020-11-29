import Assignment from "../types/Assignment"
import Submission from "../types/Submission"

const vagrantURL = 'http://192.168.33.10:8080/'


export function postSubmission(name : string, assignment: Assignment, files: string[]) : void {
    console.log("Name:", name, "assignment", assignment, "Files:", files);
    fetch(`${vagrantURL}submissions`, {
        method: 'POST',
        body: JSON.stringify({"name": name, "assignment_id": assignment._id}),
        headers: {'content-type': 'application/json'}
    }).then(response => response.json()).then(newSubmission => postFiles(newSubmission, files))
}

export function postFiles(submission: Submission, files: string[]) : void { 
    console.log("Now sending files...", files);   
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

export default {postSubmission, postFile: postFiles}