import {ISubmission, Submission} from './Submission'

export interface ISubmissionFactory {}
/**
 * Builds Submission objects
 */
export class SubmissionFactory implements ISubmissionFactory {
    static buildSubmission(id : string, name : string) : ISubmission {
        return new Submission(id,name);
    }
}