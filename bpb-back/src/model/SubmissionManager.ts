import { AnalysisResult } from '../AnalysisResult';
import {ISubmission} from './Submission';
import { ISubmissionDAO } from '../model/SubmissionDAO';

/**
 * Represents a controller for Submission objects.
 */
export interface ISubmissionManager {
    getSubmissions(assignmentId : String) : ISubmission[];
    getSubmission(submissionId : String) : ISubmission;
    createSubmission(data : JSON) : ISubmission;
    updateSubmission(submission : ISubmission, data : JSON) : void;
    processSubmissionFile(submission : ISubmission, filePath : String) : void; 
    deleteSubmission(submission : ISubmission) : void;
    compareSubmission(submissionA : ISubmission, submissionB : ISubmission) : AnalysisResult
}

export class SubmissionManager implements ISubmissionManager {

    private submissionDAO : ISubmissionDAO;

    constructor(submissionDAO : ISubmissionDAO) {
        this.submissionDAO = submissionDAO;
    }

    getSubmission(submissionId : String) : ISubmission {
        throw new Error('Method not implemented')
    }
    getSubmissions(assignmentId : String): ISubmission[] {
        //Load a submission and all of its AnalysisResultEntries from the DB
        throw new Error('Method not implemented.');
    }
    createSubmission(data : JSON): ISubmission {
        //Create and persist a submission in DB / cache
        throw new Error('Method not implemented.');
    }
    updateSubmission(submission : ISubmission, data : JSON): void {
        //Update the submission in cache and db
        throw new Error('Method not implemented.');
    }
    processSubmissionFile(submission : ISubmission, filePath : String): void {
        //Get file content from disk
        //Call submission.addfile on the submission
        //Save the submission with the new entries into the database (including pointer to filePath as metadata)
        throw new Error('Method not implemented.');
    }
    deleteSubmission(submission : ISubmission): void {
        //Delete the submission from cache and db
        throw new Error('Method not implemented.');
    }
    compareSubmission(submissionA : ISubmission, submissionB : ISubmission): AnalysisResult {
        //TODO: Actually actively perform comparison of all hashes saved for each submission
        //Delegate comparison to one of the two submissions' compare methods and return the result
        //Later, could read from database to get comparisons that already occurred (i.e. create AnalysisResult some other way)
        throw new Error('Method not implemented.');
    }
}