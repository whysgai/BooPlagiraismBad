import {postAssignment} from '../services/AssignmentService'

export function createAssignment(type : string, name : string) {

    return {
        type: 'CREATE_ASSIGNMENT',
        name: name,
        newAssignment: postAssignment(name)
    }
};