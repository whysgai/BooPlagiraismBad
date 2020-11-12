import {ISubmission, Submission} from './Submission'
import submissionModel from './SubmissionModel';

export interface ISubmissionDAO {
    createSubmission(submission : ISubmission) : Promise<void>; 
    readSubmissions(submissionIds : String[]) : Promise<ISubmission[]>;
    readSubmission(submissionId : String) : Promise<ISubmission>;
    updateSubmission(submission : ISubmission) : Promise<void>;
    deleteSubmission(submission : ISubmission) : Promise<void>;
}

export class SubmissionDAO implements ISubmissionDAO {
    
    constructor(){}
   
    async createSubmission(submission : ISubmission): Promise<void> {
        //var sub = new submissionModel({_id : submission.getId()});
        //return sub.save().then((res) => { return; });
        return undefined;
    }
    
    async readSubmissions(): Promise<ISubmission[]> {
        return undefined;
    }

    async readSubmission(submissionID: String): Promise<ISubmission> {
        return undefined;
    }

    async updateSubmission(submission: ISubmission) : Promise<void> {
        return undefined;
    }
    async deleteSubmission(submission: ISubmission): Promise<void> {
        return undefined;
    }
}