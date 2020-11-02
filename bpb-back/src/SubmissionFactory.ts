import {ISubmission} from './Submission'

export interface ISubmissionFactory {
    buildSubmission() : ISubmission;
}

export class SubmissionFactory implements ISubmissionFactory {
    buildSubmission() : ISubmission {
        throw new Error("Method not implemented.");
    }
    
}