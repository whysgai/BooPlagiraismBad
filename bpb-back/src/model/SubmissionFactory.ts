import {ISubmission} from './Submission'

export interface ISubmissionFactory {
    //buildSubmission(id : String, name : String) : ISubmission;
}

/**
 * Builds Submission objects
 */
export class SubmissionFactory implements ISubmissionFactory {
    static buildSubmission(id : String, name : String) : ISubmission {
        throw new Error("Method not implemented.");
    }
}