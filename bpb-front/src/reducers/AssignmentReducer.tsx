import { createAssignment } from "../actions/AssignmentAction";
import Action from "../types/Action"

const initialState = {
    name: '' as string,
}

const AssignmentReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'CREATE_ASSIGNMENT':

            return state
        default:
            return state;
    }
};

export default AssignmentReducer;