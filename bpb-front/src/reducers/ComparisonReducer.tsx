import SubmissionListComponent from "../components/submission/SubmissionListComponent";
import Action from "../types/Action"
import Submission from "../types/Submission";

const initialState = {
    compareSubmissions: [] as Submission[],
    comparisons: [] as JSON[],
    submissionOne: {} as Submission,
    submissionTwo: {} as Submission,
    fileOne: "" as String,
    fileTwo: "" as String,
    subOneFileContents: [] as String[],
    subTwoFileContents: [] as String[],

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
            //console.log("Comparisons in reducer", action.comparison)
            return {
                ...state,
                comparisons: action.comparison,
                // submissionOne: state.compareSubmissions[0],
                // submissionTwo: state.compareSubmissions[1]
            }
        case 'GET_SUB_ONE_FILES':
            console.log("Reducer sub one content", action.fileContents);
            return {
                ...state,
                fileOneContents: action.fileContents
            }
        case 'GET_SUB_TWO_FILES':
            console.log("Reducer sub two content", action.fileContents);
            return {
                ...state,
                fileTwoContents: action.fileContents
            }       
        default:
            return state;
    }
};

export default ComparisonReducer;