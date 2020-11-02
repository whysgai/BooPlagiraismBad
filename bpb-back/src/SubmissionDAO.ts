import {ISubmission} from './Submission'

export interface ISubmissionDAO {
    createSubmission() : ISubmission;
    readSubmission(submissionID : String) : ISubmission;
    updateSubmission(submissionID : String, submission : ISubmission) : ISubmission;
    deleteSubmission(submissionID : String) : ISubmission;
}

export class SubmissionDAO implements ISubmissionDAO {
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