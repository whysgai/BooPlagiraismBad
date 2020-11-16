import mongoose, { Document, Schema } from "mongoose";
import { IAnalysisResult, AnalysisResult } from "./AnalysisResult";
import { IAnalysisResultEntry, AnalysisResultEntry } from "./AnalysisResultEntry";
import { AnalysisResultEntryCollectorVisitor } from "./AnalysisResultEntryCollectorVisitor";

//import { parse } from 'java-ast';
//import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
import { parse } from "java-ast";
import { stringifyConfiguration } from "tslint/lib/configuration";

/**
 * Represents an Submission database model object
 */
export interface ISubmissionModel extends Document {
    _id : String
    name : String
    files : String[]
    entries : IAnalysisResultEntry[]
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
    compareAnalysisResultEntries(otherEntries : IAnalysisResultEntry[]) : IAnalysisResult;
    getModelInstance() : Document;
    asJSON() : Object;
}

 export class Submission implements ISubmission {
    
    private static submissionSchema = new Schema({
        _id:  String,
        assignment_id: String,
        name: String,
        files: [],
        entries: [Object]
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
       
        var parseTree = parse(content.toString()); //TODO: better way to primitive-ize?
        var visitor = new AnalysisResultEntryCollectorVisitor(filePath);

        visitor.visit(parseTree);

        visitor.getAnalysisResultEntries().forEach((entry) => { 
            this.addAnalysisResultEntry(entry);
         });
        
         this.files.push(filePath);
     }

     addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry): void {
         this.entries.push(analysisResultEntry);
         if(!this.files.includes(analysisResultEntry.getFilePath())) {
             this.files.push(analysisResultEntry.getFilePath());
         }
     }

    compare(otherSubmission: ISubmission) : IAnalysisResult {
        return otherSubmission.compareAnalysisResultEntries(this.entries);
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

    compareAnalysisResultEntries(entries : IAnalysisResultEntry[]) : IAnalysisResult {
        return undefined;
    }
}