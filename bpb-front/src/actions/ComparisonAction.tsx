import Submission from '../types/Submission'
import { getComparison, getFileContent } from '../services/ComparisonService'
import { getSubmission } from '../services/SubmissionService'
import Snippet from '../types/Snippet'

/**
 * The compare submissions action takes a list of two submissions and employs the getComparison() service to get
 * the comparison of the files for the selected submissions.
 * @param compareSubmissions a list of two submissions that are being compared by the user.
 */
export async function compareSubmissions(compareSubmissions : Submission[]) {
    return {
        type: 'COMPARE',
        compareSubmissions: compareSubmissions,
        comparison: await getComparison(compareSubmissions)
    }
};

/**
 * The add submission comparison action adds a submission to the compareSubmissions submission list in store.
 * @param submission the submission a user has selected to compare against another submission.
 */
export function addSubmissionComparison(submission : Submission) {
    return {
        type: 'ADD_COMPARE',
        addSubmission: submission,
    }
}

/**
 * The remove submission comparison action removes a submission from the compareSubmissions submission list in store.
 * @param submission the submission a user has decided not to compare against another submission.
 */
export function removeSubmissionComparison(submission : Submission) {
    return {
        type: 'REMOVE_COMPARE',
        removeSubmission: submission,
    }    
}

/**
 * The clear comparison submissions action removes all submissions from the compareSubmissions submission list in
 * store. This is mainly used when a user leaves a current comparison so that the store is cleared and they are able
 * to compare two newly selected submissions.
 */
export function clearComparisonSubmissions() {
    return {
        type: 'CLEAR_COMPARE',
    }
}

/**
 * The read comparison submission takes a submissionId from the list provided to an assignment and finds all 
 * submission information that is stored in the server.
 * @param submissionId the submission ID provided by the assignments submissions list.
 */
export async function readComparisonSubmission(submissionId: String) {
    let submission = await getSubmission(submissionId);
    return {
        type: 'ADD_COMPARE',
        addSubmission: submission
    }
}

/**
 * For each file in a submissions files, request the file contents and add the contents to an array of strings.
 * The contents are then returned to the store so that they may be accessed anywhere in the application.
 * @param submission the submission whose file contents are being requested
 * @param type the type is passed to the reducer to determine which action has been taken.
 */
export async function readFileContent(submission: Submission, type: String) {

    let fileContents : String[] = [];
    // For each filename in in submission.files...
    for (let i: number = 0; i < submission.files.length; i++) {
        // ...request the file contents and add that to an array of strings...
        fileContents.push(await getFileContent(submission._id, i));
    }
    // ...then return the action object with the reducer type and the array of strings
    return {
        type: type,
        fileContents: fileContents
    }
}

/**
 * The snippet list is passed to select snippets so that it may be accessed by the store.
 * @param snippets the snippets from a comparison of two files.
 */
export function selectSnippets(snippets : Snippet[]) {
    return {
        type: "SET_SNIPPET",
        snippets: snippets
    }
}