import {ISubmission} from './Submission'
import {Connection} from 'mongoose'

export interface ISubmissionDAO {
    createSubmission() : ISubmission;
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
        throw new Error('Method not implemented.');
    }
    readSubmission(submissionID: String): ISubmission {
        throw new Error('Method not implemented.');
    }
    updateSubmission(submissionID: String, submission: ISubmission) : ISubmission {
        throw new Error('Method not implemented.');
    }
    deleteSubmission(submissionID: String): ISubmission {
        throw new Error('Method not implemented.');
    }
}