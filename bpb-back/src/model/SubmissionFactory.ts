import {ISubmission, Submission} from './Submission'

export interface ISubmissionFactory {}
/**
 * Builds Submission objects
 */
export class SubmissionFactory implements ISubmissionFactory {
    static buildSubmission(name : string) : ISubmission {
        return undefined;
    }
}