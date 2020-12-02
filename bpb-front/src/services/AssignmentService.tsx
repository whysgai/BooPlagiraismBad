import Assignment from "../types/Assignment"

const assignmentURL = 'http://192.168.33.10:8080/'

export function postAssignment(name : string) : void {
    fetch(`${assignmentURL}Assignments`, {
        method: 'POST',
        body: JSON.stringify({'name': name, 'submissionIds': []}),
        headers: {'content-type': 'application/json'}
    })
}

export async function getAssignments() : Promise<Assignment[]> {
    let response = await fetch(`${assignmentURL}Assignments`);
    let asJson = await response.json();
    return Promise.resolve(asJson.assignments as Assignment[]);
}

export async function getAssignment(assignmentId : String) : Promise<Assignment> {
    let response = await fetch(`${assignmentURL}Assignments/${assignmentId}`);
    let asJson = await response.json();
    console.log("get assignment service", asJson)
    return Promise.resolve(asJson as Assignment);
}

export default {postAssignment, getAssignments, getAssignment}