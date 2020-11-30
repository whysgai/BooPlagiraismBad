import Submission from "./Submission";
import Assignment from "./Assignment";
 
type Action = {
 type: String;
 addSubmission: Submission;
 removeSubmission: Submission;
 assignment: Assignment;
 comparison: JSON[]
}
 
export default Action