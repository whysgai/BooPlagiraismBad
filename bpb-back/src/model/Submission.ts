import { IAnalysisResult } from "../AnalysisResult";
import { AnalysisResultEntry } from "../AnalysisResultEntry";

/**
 * Represents a single submission 
 * Associated with 1 assignment
 * Has 0 ... n files, represented indirectly as analysisResultEntries (hashed subtrees of files)
 */
export interface ISubmission {
    getId() : String;
    getName() : String;
    addFile(content : String, filePath : String) : void
    compare(otherSubmission : ISubmission) : IAnalysisResult
}

 export class Submission implements ISubmission {

    private id : String;
    private name : String;
    private analysisResultEntries : AnalysisResultEntry[]

    constructor(id : String, name : String){
        //TODO
    }

     getId(): String {
         throw new Error("Method not implemented.");
     }

     getName(): String {
         throw new Error("Method not implemented.");
     }

     addFile(content : String, filePath : String) : void {
        //Use library to parse provided content into a ParseTree
            //NOTE: Content is already loaded. filePath is included so that adding metadata to the AnalysisResultEntries is easier
        //Instantiates an AnalysisResultCollectorVisitor (passing filePath into constructor)
        //Run AnalysisResultCollectorVisitor on the submission file's ParseTree
        //Gets list of entries from AnalysisResultCollectorVisitor.getEntries
        //Add AnalysisResultEntries to the submission
        throw new Error("Method not implemented")
     }

    compare(otherSubmission: ISubmission) : IAnalysisResult {
        //Calls compareResultEntries on otherSubmission, passing in our submission entries from this submission
        //Returns the result provided by compareResultEntries
        throw new Error("Method not implemented.");
    }

    //Actually perform comparison of entries to entries here
    protected compareResultEntries(otherSubmissionEntries : AnalysisResultEntry[]) : IAnalysisResult {
        throw new Error("Not implemented")
    }
}