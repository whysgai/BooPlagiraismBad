import Assignment from "../types/Assignment"

// the URL that is used for the server
const vagrantURL = 'http://192.168.33.10:8080/'
const envURL = process.env.REACT_APP_BPB_SRVADDR
/**
 * The post assignment function adds an assignment to the server.
 * @param name the name of an assignment that is being created.
 */
export function postAssignment(name : string) : void {
    fetch(`${envURL}Assignments`, {
        method: 'POST',
        body: JSON.stringify({'name': name, 'submissionIds': []}),
        headers: {'content-type': 'application/json'}
    });
}

/**
 * The delete assignment service deletes an assignment from the server.
 * @param assignment the assignment thats being deleted from the server.
 */
export function deleteAssignment(assignment: Assignment) : void {
    fetch(`${envURL}Assignments/${assignment._id}`, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'}
    }).then(response =>
        response.json().then(json => {
          return json;
        }))
}

/**
 * The get assignments service returns a list of assignments to the client side so that they can be 
 * stored and displayed for users.
 */
export async function getAssignments() : Promise<Assignment[]> {
    console.log("Get all assignments at", envURL);
    let response = await fetch(`${envURL}Assignments`);
    let asJson = await response.json();
    return Promise.resolve(asJson.assignments as Assignment[]);
}

/**
 * The get assignment service takes an assignment id and fetches the assignment from the server.
 * This is mainly used when a user refreshes their screen when looking at a particular assignment so the correct
 * assignment information is still displayed even though the store has been cleared from the refresh.
 * @param assignmentId the assignment ID of the assignment whose information is being fetched from the server.
 */
export async function getAssignment(assignmentId : String) : Promise<Assignment> {
    let response = await fetch(`${envURL}Assignments/${assignmentId}`);
    let asJson = await response.json();
    //console.log("get assignment service", asJson)
    return Promise.resolve(asJson as Assignment);
}

export default {postAssignment, getAssignments, getAssignment}