import Action from "../types/Action"
import Submission from "../types/Submission";
import Snippet from "../types/Snippet";
import Comparison from "../types/Comparison";

/**
 * Set the initial state of the comparison reducer. This can be used to read state and set state from a users actions
 * in the client side.
 */
const initialState = {
    compareSubmissions: [] as Submission[],
    comparisons: [] as Comparison[],
    submissionOne: {} as Submission,
    submissionTwo: {} as Submission,
    fileOne: "" as String,
    fileTwo: "" as String,
    subOneFileContents: [] as String[],
    subTwoFileContents: [] as String[],
    snippetFileOne: {} as Snippet,
    snippetFileTwo: {} as Snippet
}

/**
 * The comparison reducer allows a user to add, remove and clear submissions from the compareSubmissions list, get
 * the files of each submission being compared, get the comparisons of two submissions and set the snippet that
 * has been accessed by a user.
 * @param state the state of the comparison reducer.
 * @param action the action that is being used.
 */
const ComparisonReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'ADD_COMPARE':
            if (state.compareSubmissions.length < 2) {
                state.compareSubmissions.push(action.addSubmission)
            }
            return state
        case 'REMOVE_COMPARE':
            if (state.compareSubmissions.length === 0) {
                return state
            } else {
                state.compareSubmissions = state.compareSubmissions.filter(subIndex => subIndex !== action.removeSubmission)
                return state
            }
        case 'CLEAR_COMPARE':
            return {
                ...state,
                compareSubmissions: []
            }
        case 'COMPARE':
            return {
                ...state,
                comparisons: action.comparison,
            }
        case 'GET_SUB_ONE_FILES':
            return {
                ...state,
                fileOneContents: action.fileContents
            }
        case 'GET_SUB_TWO_FILES':
            return {
                ...state,
                fileTwoContents: action.fileContents
            }   
        case 'SET_SNIPPET':
            return {
                ...state,
                snippetFileOne: action.snippets[0],
                snippetFileTwo: action.snippets[1]
            } 
        default:
            return state;
    }
};

export default ComparisonReducer;