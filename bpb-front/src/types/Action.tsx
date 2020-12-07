import Submission from "./Submission";
import Assignment from "./Assignment";
import Snippet from "./Snippet";
 
/**
 * This is an action type. Actions are passed into reducers so any time an action is called this is the 
 * type associated with it. An action consists of the below properties.
 */
type Action = {
 type: String;
 addSubmission: Submission;
 removeSubmission: Submission;
 assignment: Assignment;
 assignments: Assignment[];
 comparison: JSON[];
 submissions: Submission[];
 fileContents: String[];
 snippets: Snippet[]
}
 
export default Action