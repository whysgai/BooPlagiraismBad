import {ISubmission, Submission} from './Submission'
//import submissionModel from './SubmissionModel';

export interface ISubmissionDAO {
    createSubmission(submission : ISubmission) : Promise<void>; 
    readSubmissions(submissionIds : String[]) : Promise<ISubmission[]>;
    readSubmission(submissionId : String) : Promise<ISubmission>;
    updateSubmission(submission : ISubmission) : Promise<void>;
    deleteSubmission(submission : ISubmission) : Promise<void>;
}
/**
 * Singleton Data Access Object for manipulating Assignment database objects.
 */
export class SubmissionDAO implements ISubmissionDAO {
    
    constructor(){
        //TODO: Singletonness
    }
    
    async createSubmission(submission : ISubmission): Promise<void> {
        //Create the submission in DB
        //var sub = new submissionModel({_id : submission.getId()});
        //return sub.save().then((res) => { return; });
        return undefined;
    }
    
    async readSubmissions(): Promise<ISubmission[]> {
        //Return the specified submissions from db
        //Return a list of all submissionIDs? This probably needs some kind of filter (i.e. assignments?)
        //TODO: Add parameter for assignmentId to use as filter
        return undefined;
    }

    async readSubmission(submissionID: String): Promise<ISubmission> {
        //Return submission and all of its AnalysisResultEntries
        return undefined;
    }

    async updateSubmission(submission: ISubmission) : Promise<void> {
        //Add any new not-persisted AnalysisResultEntries into the database
        return undefined;
    }
    async deleteSubmission(submission: ISubmission): Promise<void> {
        //Delete the specified submission from the db
        return undefined;
    }
}