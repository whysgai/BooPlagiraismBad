import {postAssignment, getAssignments, getAssignment, deleteAssignment} from '../services/AssignmentService'
import Assignment from '../types/Assignment'
import { getSubmissionIds, deleteSubmission } from '../services/SubmissionService';

/**
 * The create assignment action uses the front end provided name to call a postAssignment() service which sends
 * the name of an assignment and registers it in the backend.
 * @param type the type is passed to the reducer to determine which action has been taken.
 * @param name the name of the assignment the user is creating.
 */
export function createAssignment(type : string, name : string) {
    return {
        type: type,
        name: name,
        newAssignment: postAssignment(name)
    }
};

/**
 * The set current assignment action sends the assignment a user has selected to view to the reducer so that it 
 * can be set in store.
 * @param type the type is passed to the reducer to determine which action has been taken.
 * @param assignment the assignment the user has selected to view the submissions of.
 */
export function setCurrentAssignment(type : string, assignment : Assignment) {
    return {
        type: type,
        assignment: assignment
    }
};

/**
 * Setting current assignment from ID takes the assignment ID from the users current URL and sets the current
 * assignment in store based on the assignment ID. This is used when a user refreshes a page so that they do not
 * lose the assignment they were viewing.
 * @param type the type is passed to the reducer to determine which action has been taken.
 * @param assignmentId the assignment ID the user is viewing the submissions of.
 */
export function setCurrentAssignmentFromId(type : string, assignmentId : String) {
    return getAssignment(assignmentId).then(async (assignment: Assignment) => {
        return {
            type: type,
            assignment: assignment
        }
    });
};

/**
 * The read assignments action reads the assignments from the back end by using the getAssignments() assignment service
 */
export function readAssignments() {
    return getAssignments().then((assignments) => {
        return {
            type: 'READ_ASSIGNMENTS',
            assignments: assignments
        }
    });
}

/**
 * The remove assignment action employs the getSubmissionIds() service to remove all submissions in the server that
 * are associated with the assignment being removed. It then uses the deleteAssignment() service to delete the
 * assignment from the server. It returns the reducer type and assignment being deleted so that it can be removed
 * from the store as well.
 * @param assignment the assignment that is being removed from the backend and from the assignment list.
 */
export function removeAssignment(assignment: Assignment) : any {
    getSubmissionIds(assignment._id).then((submissionIds) => {
        for (let submissionId of submissionIds) {
            deleteSubmission(submissionId)
        }
    })
    deleteAssignment(assignment)
    return {
        type: 'DELETE_ASSIGNMENT',
        assignment: assignment,
    }
};