import { AnalysisResult } from './AnalysisResult';
import {ISubmission} from './Submission';
import { ISubmissionDAO } from './SubmissionDAO';
import { ISubmissionFactory } from './SubmissionFactory';

export interface ISubmissionManager {
    getSubmissions() : ISubmission[];
    createSubmission() : ISubmission;
    updateSubmission() : ISubmission;
    addFile(jsonFile : JSON) : void;
    deleteSubmission() : void;
    compareSubmission(aUID : String, bUID : String) : AnalysisResult
}

export class SubmissionManager implements ISubmissionManager {
   // submissions : ISubmission[];
    //submissionFactory : ISubmissionFactory;

    private submissionDAO : ISubmissionDAO;

    constructor(submissionDAO : ISubmissionDAO) {
        this.submissionDAO = submissionDAO;
    }

    getSubmissions(): ISubmission[] {
        //Load a submission and all of its NodeHashes from the DB
        throw new Error('Method not implemented.');
    }
    createSubmission(): ISubmission {
        throw new Error('Method not implemented.');
    }
    updateSubmission(): ISubmission {
        throw new Error('Method not implemented.');
    }
    addFile(jsonFile: JSON): void {
        //Process a file into AST -> AnalysisResultEntries 
        //Add file to the specified submission (included in jsonFile from request body)
        //Save the submission with the new entries into the database
        throw new Error('Method not implemented.');
    }
    deleteSubmission(): void {
        throw new Error('Method not implemented.');
    }
    compareSubmission(aUID: String, bUID: String): AnalysisResult {
        //TODO: Actually actively perform comparison of all hashes saved for each submission
        throw new Error('Method not implemented.');
    }

}