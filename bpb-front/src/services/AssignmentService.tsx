import Assignment from "../types/Assignment"

const vagrantURL = 'http://192.168.33.10:8080/'

export function postAssignment(name : string) : void {
    fetch(`${vagrantURL}Assignments`, {
        method: 'POST',
        body: JSON.stringify({'name': name, 'submissionIds': []}),
        headers: {'content-type': 'application/json'}
    })
}

export function deleteAssignment(assignment: Assignment) : void {
    fetch(`${vagrantURL}Assignments/${assignment._id}`, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'}
    }).then(response =>
        response.json().then(json => {
          return json;
        }))
}

export async function getAssignments() : Promise<Assignment[]> {
    let response = await fetch(`${vagrantURL}Assignments`);
    let asJson = await response.json();
    return Promise.resolve(asJson.assignments as Assignment[]);
}

export async function getAssignment(assignmentId : String) : Promise<Assignment> {
    let response = await fetch(`${vagrantURL}Assignments/${assignmentId}`);
    let asJson = await response.json();
    //console.log("get assignment service", asJson)
    return Promise.resolve(asJson as Assignment);
}

export default {postAssignment, getAssignments, getAssignment}