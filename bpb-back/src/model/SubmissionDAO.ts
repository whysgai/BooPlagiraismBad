import {ISubmission, Submission} from './Submission'

export interface ISubmissionDAO {
    createSubmission(name : string, assignment_id : string) : Promise<ISubmission>; 
    readSubmissions(assignmentId : string) : Promise<ISubmission[]>;
    readSubmission(submissionId : string) : Promise<ISubmission>;
    updateSubmission(submission : ISubmission) : Promise<ISubmission>;
    deleteSubmission(submissionId : string) : Promise<ISubmission>;
}
/**
 * Singleton Data Access Object for manipulating Assignment database objects.
 */
export class SubmissionDAO implements ISubmissionDAO {
    
    constructor(){
        //TODO: Singletonness
    }
    
    async createSubmission(name : string, assignmentId : string): Promise<ISubmission> {
        //Create the submission in DB
        //var sub = new submissionModel({_id : submission.getId()});
        //return sub.save().then((res) => { return; });
        return undefined;
    }
    
    async readSubmissions(assignmentId : string): Promise<ISubmission[]> {
        //Return all submissions of assignment
        return undefined;
    }

    async readSubmission(submissionId: string): Promise<ISubmission> {
        //Return submission and all of its AnalysisResultEntries
        return undefined;
    }

    async updateSubmission(submission: ISubmission) : Promise<ISubmission> {
        //Add any new not-persisted AnalysisResultEntries into the database
        return undefined;
    }
    async deleteSubmission(submissionId : string): Promise<ISubmission> {
        //Delete the specified submission from the db
        return undefined;
    }
}