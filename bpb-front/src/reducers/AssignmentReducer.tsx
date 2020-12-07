import Action from "../types/Action"
import Assignment from "../types/Assignment";

/**
 * Set the initial state of assignments with a name, current assignment object, and an assignment list that can be
 * pulled from this reducers store.
 */
const initialState = {
    name: '' as string,
    currentAssignment: {} as Assignment,
    assignments: [] as Assignment[]
}

/**
 * The assignment reducer allows the store to update the users selected assignment, set the assignment list,
 * delete an assignment from the assignment list, and return state.
 * @param state the state of the assignment reducer.
 * @param action the action that is being used.
 */
const AssignmentReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'SET_CURRENT_ASSIGNMENT':
            return {
                ...state,
                currentAssignment: action.assignment
            }
        case 'READ_ASSIGNMENTS':
            return {
                ...state,
                assignments: action.assignments
            }  
        case 'DELETE_ASSIGNMENT':
            let newAssignments : Assignment[] = [];
            let assignment : Assignment;
            for (assignment of state.assignments) {
                if (assignment != action.assignment) {
                    newAssignments.push(assignment)
                }
            }
            return {
                ...state,
                assignments: newAssignments
            }
        case 'CREATE_ASSIGNMENT':
        default:
            return state;
    }
};

export default AssignmentReducer;