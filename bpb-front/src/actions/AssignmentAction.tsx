import {postAssignment, getAssignments, getAssignment, deleteAssignment} from '../services/AssignmentService'
import Assignment from '../types/Assignment'
import { getSubmissionIds } from '../services/SubmissionService';

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

export function setCurrentAssignmentFromId(type : string, assignmentId : String) {
    return getAssignment(assignmentId).then(async (assignment: Assignment) => {
        //console.log("action set assignment from id", assignment)
        return {
            type: type,
            assignment: assignment
        }
    });
};

export function readAssignments() {
    return getAssignments().then((assignments) => {
        return {
            type: 'READ_ASSIGNMENTS',
            assignments: assignments
        }
    });
}

export function removeAssignment(assignment: Assignment) : any {
    getSubmissionIds(assignment._id).then((submissionIds) => {
        for (let submissionId of submissionIds) {
            // call remove submission on submissionId
        }
    }) //removed return on getSubmissionIds, this may need some refactoring if async is messed up
    deleteAssignment(assignment)
    return {
        type: 'DELETE_ASSIGNMENT',
        assignment: assignment,
    }
};