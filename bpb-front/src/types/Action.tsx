import Submission from "./Submission";
 
type Action = {
 type: String;
 addSubmission?: Submission;
 removeSubmission?: Submission;
}
 
export default Action