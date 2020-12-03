import Submission from "./Submission";
import Assignment from "./Assignment";
 
type Action = {
 type: String;
 addSubmission: Submission;
 removeSubmission: Submission;
 assignment: Assignment;
 assignments: Assignment[];
 comparison: JSON[];
 submissions: Submission[];
 fileContents: String[];
}
 
export default Action