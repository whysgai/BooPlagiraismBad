import {ISubmission, Submission} from './Submission'
//import submissionModel from './SubmissionModel';

export interface ISubmissionDAO {
    createSubmission(name : String, assignment_id : String) : Promise<ISubmission>; 
    readSubmissions(assignmentId : String) : Promise<ISubmission[]>;
    readSubmission(submissionId : String) : Promise<ISubmission>;
    updateSubmission(submission : ISubmission) : Promise<ISubmission>;
    deleteSubmission(submissionId : String) : Promise<ISubmission>;
}
/**
 * Singleton Data Access Object for manipulating Assignment database objects.
 */
export class SubmissionDAO implements ISubmissionDAO {
    
    constructor(){
        //TODO: Singletonness
    }
    
    async createSubmission(name : String, assignmentId : String): Promise<ISubmission> {
        //Create the submission in DB
        //var sub = new submissionModel({_id : submission.getId()});
        //return sub.save().then((res) => { return; });
        return undefined;
    }
    
    async readSubmissions(assignmentId : String): Promise<ISubmission[]> {
        //Return all submissions of assignment
        return undefined;
    }

    async readSubmission(submissionId: String): Promise<ISubmission> {
        //Return submission and all of its AnalysisResultEntries
        return undefined;
    }

    async updateSubmission(submission: ISubmission) : Promise<ISubmission> {
        //Add any new not-persisted AnalysisResultEntries into the database
        return undefined;
    }
    async deleteSubmission(submissionId : String): Promise<ISubmission> {
        //Delete the specified submission from the db
        return undefined;
    }
}