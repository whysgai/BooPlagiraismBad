import {postAssignment} from '../services/AssignmentService'
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