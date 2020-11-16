import mongoose, { Document, Schema } from "mongoose";
import { IAnalysisResult, AnalysisResult } from "./AnalysisResult";
import { IAnalysisResultEntry, AnalysisResultEntry } from "./AnalysisResultEntry";
import { AnalysisResultEntryCollectorVisitor } from "./AnalysisResultEntryCollectorVisitor";

import {parse} from 'java-ast'; //Commented out because not working
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';

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
    setAssignmentId(newId : String) : void;
    getName() : String;
    setName(newName : String) : void;
    getFiles() : String[];
    addFile(content : String, filePath : String) : Promise<void>;
    addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry) : void;
    hasAnalysisResultEntries() : boolean;
    compare(otherSubmission : ISubmission) : IAnalysisResult;
    compareAnalysisResultEntries(otherEntries : IAnalysisResultEntry[]) : IAnalysisResult;
    getModelInstance() : Document;
    asJSON() : Object;
}

 export class Submission implements ISubmission {
    
    //Note: removed _id from schema in order to generate it on creation (should still exist in the model)
    private static submissionSchema = new Schema({
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

    constructor(id: String, name : String){
        this.id = id;
        this.name = name
        this.entries = [];
        this.files = [];
    }

    static getStaticModel() :  mongoose.Model<ISubmissionModel> {
        return this.submissionModel;
    }

    getId() : String {
        return this.id;
    }
     
    getAssignmentId(): String {
         return this.assignment_id;
     }

     setAssignmentId(newId : String): void {
         this.assignment_id = newId;
     }

     getName(): String {
         return this.name;
     }

     setName(newName : String): void {
         this.name = newName;
     }


     getFiles() : String[] {
         return this.files;
     }

     async addFile(content : String, filePath : String) : Promise<void> {
      
        if(this.files.includes(filePath)) {
            return Promise.reject(new Error("File at " + filePath + " was already added to the submission"));
        }

        this.files.push(filePath);

        var parseTree = parse(content.toString());
        var visitor = new AnalysisResultEntryCollectorVisitor(filePath);

        visitor.visit(parseTree);

        visitor.getAnalysisResultEntries().forEach((entry) => { 
            this.addAnalysisResultEntry(entry);
         });

         return Promise.resolve();
     }

     addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry): void {
         this.entries.push(analysisResultEntry);
         if(!this.files.includes(analysisResultEntry.getFilePath())) {
             this.files.push(analysisResultEntry.getFilePath());
         }
     }

    compare(otherSubmission: ISubmission) : IAnalysisResult {
        if(this.entries.length <= 0 ) {
            throw new Error("Cannot compare: A comparator submission has no entries");
        }
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
        
        if(this.entries.length <= 0) {
            throw new Error("Cannot compare: A comparator submission has no entries");
        }

        var analysisResult = new AnalysisResult();

        this.entries.forEach((entry) => {
            entries.forEach((otherEntry) => {

                var hashA = entry.getHashValue();
                var hashB = otherEntry.getHashValue();

                //TODO: Replace
                var comparison = 1;
                var threshold = 0;

                if(comparison > threshold) {  
                    analysisResult.addMatch(entry,otherEntry);
                }
            });
        });

        return analysisResult;
    }
}