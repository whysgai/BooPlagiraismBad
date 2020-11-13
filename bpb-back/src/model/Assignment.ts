import { IAssignmentManager } from "./AssignmentManager";

/**
 * Represents an Assignment to which Submissions may be made.
 */
export interface IAssignment {
    getID() : String
    getName() : String
    getSubmissionIDs() : String[]
    addSubmission(submissionID : String) : void
    removeSubmission(submissionID : String) : void
}

export class Assignment implements IAssignment {
    //private id : String;
    //private name : String;
    //private submissionIDs : String[];
    
    getID(): String {
        throw new Error("Method not implemented.");
    }
    getName(): String {
        throw new Error("Method not implemented.");
    }
    getSubmissionIDs(): String[] {
        throw new Error("Method not implemented.");
    }
    addSubmission(submissionID: String): void {
        throw new Error("Method not implemented.");
    }
    removeSubmission(submissionID: String): void {
        throw new Error("Method not implemented.");
    }

}