import { compareSubmissions } from "../actions/ComparisonAction";

const initialState = {
    compareSubmissions: [],
}

const ComparisonReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_COMPARE':
            if (state.compareSubmissions.length < 2) {
                state.compareSubmissions.push(action.submission)
            }
            else {
                // throw an error?
            }
            return state
        case 'REMOVE_COMPARE':
            if (state.compareSubmissions.length == 0) {
                return state
            }
            state.compareSubmissions = state.compareSubmissions.filter(subIndex => subIndex != action.submission)
            return state
        case 'COMPARE':
            return //TODO;
        default:
            return state;
    }
};

export default ComparisonReducer;