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

// export async function getAssignments() : Promise<any> {
//     fetch(`${assignmentURL}Assignments`).then((response) => response.json()).then((result) => resolve(result.assignments));
// }

// export function getAssignments() : Promise<JSON> {
//     return fetch(`${assignmentURL}Assignments`).then(response => response.json())
// }

// export function getAssignments() : Promise<any> {
//     return new Promise((resolve, reject) => {
//         fetch(`${assignmentURL}Assignments`)
//             .then((response) => response.json())
//                 .then((result) => resolve(result.assignments))
//                     .catch((err) => reject(err))
//     });    
// }

export default {postAssignment, getAssignments}