import Submission from "./Submission";
import Assignment from "./Assignment";
import Snippet from "./Snippet";
 
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