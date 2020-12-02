import SubmissionListComponent from "../components/submission/SubmissionListComponent";
import Action from "../types/Action"
import Submission from "../types/Submission";

const initialState = {
    compareSubmissions: [] as Submission[],
    comparison: [] as JSON[],
    submissionOne: {} as Submission,
    submissionTwo: {} as Submission,
    fileOne: "" as String,
    fileTwo: "" as String,
    fileOneContent: "" as String,
    fileTwoContent: "" as String,

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
                submissionOne: state.compareSubmissions[0],
                submissionTwo: state.compareSubmissions[1]
            }
        case 'GET_FILE_ONE':
            return {
                ...state,
                fileOneContent: action.fileContent
            }
        case 'GET_FILE_TWO':
            return {
                ...state,
                fileTwoContent: action.fileContent
            }       
        default:
            return state;
    }
};

export default ComparisonReducer;