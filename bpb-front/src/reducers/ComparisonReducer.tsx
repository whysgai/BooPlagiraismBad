import SubmissionListComponent from "../components/submission/SubmissionListComponent";
import Action from "../types/Action"
import Submission from "../types/Submission";
import Snippet from "../types/Snippet";
import Comparison from "../types/Comparison";

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
            console.log("reducer snippets", action.snippets)
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