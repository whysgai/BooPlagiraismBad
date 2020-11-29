const assignmentURL = 'http://192.168.33.10:8080/'

export function postAssignment(name : string) : void {
    fetch(`${assignmentURL}Assignments`, {
        method: 'POST',
        body: JSON.stringify({'name': name, 'submissionIds': []}),
        headers: {'content-type': 'application/json'}
    })
}

export default {postAssignment}