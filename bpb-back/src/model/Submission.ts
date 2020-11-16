import mongoose, { Document, Schema } from "mongoose";
import { IAnalysisResult, AnalysisResult } from "./AnalysisResult";
import { IAnalysisResultEntry, AnalysisResultEntry } from "./AnalysisResultEntry";

//import { parse } from 'java-ast';
//import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';

/**
 * Represents an Submission database model object
 */
export interface ISubmissionModel extends Document {
    _id : String
    name : String
    files : String[]
    entry_ids : String[]
}

/**
 * Represents a single submission 
 * Associated with 1 assignment
 * Has 0 ... n files, represented indirectly as analysisResultEntries (hashed subtrees of files)
 */
export interface ISubmission {
    getId() : String;
    getAssignmentId() : String;
    getName() : String;
    getFiles() : String[];
    addFile(content : String, filePath : String) : void;
    addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry) : void;
    hasAnalysisResultEntries() : boolean;
    compare(otherSubmission : ISubmission) : IAnalysisResult;
    getModelInstance() : Document;
    asJSON() : Object;
}

 export class Submission implements ISubmission {
    
    private static submissionSchema = new Schema({
        _id:  String,
        assignment_id: String,
        name: String,
        files: [String],
        entries: [String]
      });

    private static submissionModel = mongoose.model<ISubmissionModel>('Submission',Submission.submissionSchema);
    
    private id : String;
    private assignment_id : String;
    private name : String;
    private files : String[];
    private entries : IAnalysisResultEntry[];

    constructor(id : String, name : String){
        this.id = id;
        this.name = name
        this.entries = [];
        this.files = [];
    }

    static getStaticModel() :  mongoose.Model<ISubmissionModel> {
        return this.submissionModel;
    }

     getId(): String {
         return this.id;
     }

     getAssignmentId(): String {
         return this.assignment_id;
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
         this.entries.push(analysisResultEntry);
     }

    compare(otherSubmission: ISubmission) : IAnalysisResult {
        //Calls compareResultEntries on otherSubmission, passing in our submission entries from this submission
        //Returns the result provided by compareResultEntries
        throw new Error("Method not implemented.");
    }
    asJSON() : Object {
        return {assignment_id:this.id, name:this.name, files:this.files,entries:this.entries};
    }

    getModelInstance() : Document {
        return new Submission.submissionModel({"_id":this.id,"name":this.name,"files":this.files,"entries":this.entries});
    }

    hasAnalysisResultEntries() : boolean {
        if(this.entries.length > 0) {
            return true;
        }

        return false;
    }
}