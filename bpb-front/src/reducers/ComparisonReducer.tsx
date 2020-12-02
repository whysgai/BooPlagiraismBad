import SubmissionListComponent from "../components/submission/SubmissionListComponent";
import Action from "../types/Action"
import Submission from "../types/Submission";

const initialState = {
    compareSubmissions: [] as Submission[],
    submissionOne: {} as Submission,
    submissionTwo: {} as Submission,
    comparison: [] as JSON[],
}

const ComparisonReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'ADD_COMPARE':

            if (state.compareSubmissions.length < 2) {
                state.compareSubmissions.push(action.addSubmission)
            }
            else {
                // throw an error?
            }
            return state
        case 'REMOVE_COMPARE':
            if (state.compareSubmissions.length === 0) {
                return state
            } else {
                state.compareSubmissions = state.compareSubmissions.filter(subIndex => subIndex !== action.removeSubmission)
                return state
            }
        case 'COMPARE':
            return {
                ...state,
                comparison: action.comparison,
                submissionOne: action.comparison[0],
                submissionTwo: action.comparison[1]
            }
        default:
            return state;
    }
};

export default ComparisonReducer;