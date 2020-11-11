import {ISubmission, Submission} from './Submission'
import submissionModel from './SubmissionModel';

export interface ISubmissionDAO {
    createSubmission(submissionId : String) : Promise<void>; //TODO: Change response type to non-void  (?)
    readSubmissions() : Promise<ISubmission[]>;
    readSubmission(submissionID : String) : Promise<ISubmission>;
    updateSubmission(submissionID : String, submission : ISubmission) : Promise<ISubmission>;
    deleteSubmission(submissionID : String) : Promise<void>;
}

export class SubmissionDAO implements ISubmissionDAO {
    
    constructor(){
    }
   
    //TODO: Placeholder for createSubmission (testing SubmissionDAO)
    //TODO: handle "id exists" error
    async createSubmission(submissionID : String): Promise<void> {
        var sub = new submissionModel({_id : submissionID});
        return sub.save().then((res) => { return; });
    }
    
    async readSubmissions(): Promise<ISubmission[]> {
        return undefined;
    }

    async readSubmission(submissionID: String): Promise<ISubmission> {
        return undefined;
    }

    async updateSubmission(submissionID: String, submission: ISubmission) : Promise<ISubmission> {
        return undefined;
    }
    async deleteSubmission(submissionID: String): Promise<void> {
        return undefined;
    }
}