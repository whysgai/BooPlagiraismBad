import {ISubmission} from './Submission'
import {Connection} from 'mongoose'

export interface ISubmissionDAO {
    createSubmission() : ISubmission;
    readSubmissions() : ISubmission[];
    readSubmission(submissionID : String) : ISubmission;
    updateSubmission(submissionID : String, submission : ISubmission) : ISubmission;
    deleteSubmission(submissionID : String) : ISubmission;
}

export class SubmissionDAO implements ISubmissionDAO {
    
    private dbConnection : Connection;

    constructor(dbConnection : Connection){
        this.dbConnection = dbConnection;
    }
    
    createSubmission(): ISubmission {
        return undefined;
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