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
        return null; //TODO
    }
    
    readSubmissions(): ISubmission[] {
        return []; //TODO (also add to interface)
    }

    readSubmission(submissionID: String): ISubmission {
        return undefined; //TODO
    }
    updateSubmission(submissionID: String, submission: ISubmission) : ISubmission {
        throw new Error('Method not implemented.');
    }
    deleteSubmission(submissionID: String): ISubmission {
        return undefined;
    }
}