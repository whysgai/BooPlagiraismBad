import Action from "../types/Action"
import Assignment from "../types/Assignment";

const initialState = {
    name: '' as string,
    currentAssignment: {} as Assignment,
    assignments: [] as Assignment[]
}

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
        case 'CREATE_ASSIGNMENT':
        default:
            return state;
    }
};

export default AssignmentReducer;