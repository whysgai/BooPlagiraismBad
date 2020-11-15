import { IAnalysisResult } from "../AnalysisResult";
import { AnalysisResultEntry } from "../AnalysisResultEntry";
//import { parse } from 'java-ast';
//import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';

/**
 * Represents a single submission 
 * Associated with 1 assignment
 * Has 0 ... n files, represented indirectly as analysisResultEntries (hashed subtrees of files)
 */
export interface ISubmission {
    getId() : String;
    getName() : String;
    getFiles() : String[];
    addFile(content : String, filePath : String) : void;
    addAnalysisResultEntry(analysisResultEntry : AnalysisResultEntry) : void;
    hasAnalysResultEntries() : boolean;
    compare(otherSubmission : ISubmission) : IAnalysisResult;
    asJSON() : Object;
}

 export class Submission implements ISubmission {

    private id : String;
    private name : String;
    private files : String[];
    private analysisResultEntries : AnalysisResultEntry[]

    constructor(id : String, name : String){
        this.id = id;
        this.name = name
        this.analysisResultEntries = [];
        this.files = [];
    }

     getId(): String {
         return this.id;
     }

     getName(): String {
         return this.name;
     }

     getFiles() : String[] {
         return this.files;
     }

     addFile(content : String, filePath : String) : void {
        //Use library to parse provided content into a ParseTree
            //NOTE: Content is already loaded. filePath is included so that adding metadata to the AnalysisResultEntries is easier
        //Instantiates an AnalysisResultCollectorVisitor (passing filePath into constructor)
        //Run AnalysisResultCollectorVisitor on the submission file's ParseTree
        //Gets list of entries from AnalysisResultCollectorVisitor.getEntries
        //Add AnalysisResultEntries to the submission
        //Add filePath to the submission's files
        this.files.push(filePath); //TODO: Remove temporary implementation (required to test SubmissionRouter)
     }

     addAnalysisResultEntry(analysisResultEntry : AnalysisResultEntry): void {
         this.analysisResultEntries.push(analysisResultEntry);
     }

    compare(otherSubmission: ISubmission) : IAnalysisResult {
        //Calls compareResultEntries on otherSubmission, passing in our submission entries from this submission
        //Returns the result provided by compareResultEntries
        throw new Error("Method not implemented.");
    }
    asJSON() : Object {
        return {assignment_id:this.id, name:this.name, analysisResultEntries:this.analysisResultEntries};
    }

    hasAnalysResultEntries() : boolean {
        if(this.analysisResultEntries.length > 0) {
            return true;
        }

        return false;
    }

    //Actually perform comparison of entries to entries here
    protected compareResultEntries(otherSubmissionEntries : AnalysisResultEntry[]) : IAnalysisResult {
        throw new Error("Not implemented")
    }
}