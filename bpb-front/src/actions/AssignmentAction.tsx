import {postAssignment, getAssignments} from '../services/AssignmentService'
import Assignment from '../types/Assignment'

export function createAssignment(type : string, name : string) {
    return {
        type: 'CREATE_ASSIGNMENT',
        name: name,
        newAssignment: postAssignment(name)
    }
};

export function setCurrentAssignment(type : string, assignment : Assignment) {

    return {
        type: 'SET_CURRENT_ASSIGNMENT',
        assignment: assignment
    }
};

export function readAssignments() {
    let assignments = getAssignments().then((result) => result);
    console.log("From Action:", assignments);
    return {
        type: 'READ_ASSIGNMENTS',
        assignments: assignments
    }
}

// export function readAssignments() : Promise<JSON> {
//     return getAssignments().then((assignments) =>{
//         return new Promise((resolve, reject) => {
//                     resolve({
//                         type: 'READ_ASSIGNMENTS',
//                         assignments: assignments
//                     })
//                 })
//     })
// }