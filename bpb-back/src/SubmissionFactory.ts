import {ISubmission} from './Submission'

export interface ISubmissionFactory {
    buildSubmission(id : String, name : String) : ISubmission;
}

export class SubmissionFactory implements ISubmissionFactory {
    buildSubmission(id : String, name : String) : ISubmission {
        throw new Error("Method not implemented.");
    }
}