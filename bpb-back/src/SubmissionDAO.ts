import {ISubmission, Submission} from './Submission'
import {Connection} from 'mongoose'
import submissionModel from './SubmissionModel';

export interface ISubmissionDAO {
    createSubmission(submissionId : String) : Promise<void>; //TODO: Change response type to non-void  (?)
    readSubmissions() : ISubmission[];
    readSubmission(submissionID : String) : ISubmission;
    updateSubmission(submissionID : String, submission : ISubmission) : ISubmission;
    deleteSubmission(submissionID : String) : ISubmission;
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
    
    readSubmissions(): ISubmission[] {
        return undefined;
    }

    readSubmission(submissionID: String): ISubmission {
        return undefined;
    }
    updateSubmission(submissionID: String, submission: ISubmission) : ISubmission {
        return undefined;
    }
    deleteSubmission(submissionID: String): ISubmission {
        return undefined;
    }
}