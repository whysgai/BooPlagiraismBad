import mongoose, { Document, Schema } from "mongoose";
import { IAnalysisResult, AnalysisResult } from "./AnalysisResult";
import { IAnalysisResultEntry } from "./AnalysisResultEntry";
import { AnalysisResultEntryCollectorVisitor } from "./AnalysisResultEntryCollectorVisitor";

import {parse} from 'java-ast'; 
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';

/**
 * Represents an Submission database model object
 */
export interface ISubmissionModel extends Document {
    _id : string
    assignment_id : string
    name : string
    files : string[]
    entries : IAnalysisResultEntry[]
}

/**
 * Represents a single submission 
 * Associated with 1 assignment
 * Has 0 ... n files, represented indirectly as analysisResultEntries (hashed subtrees of files)
 */
export interface ISubmission {
    getId() : string;
    getAssignmentId() : string;
    setAssignmentId(newId : string) : void;
    getName() : string;
    setName(newName : string) : void;
    getEntries() : IAnalysisResultEntry[];
    setEntries(entries: IAnalysisResultEntry[]) :void;
    getModelInstance() : ISubmissionModel;
    getFiles() : string[];
    setFiles(files : string[]) : void;
    addFile(content : string, filePath : string) : Promise<void>;
    addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry) : void;
    compare(otherSubmission : ISubmission) : IAnalysisResult;
    compareAnalysisResultEntries(otherEntries : IAnalysisResultEntry[]) : IAnalysisResult;
    asJSON() : Object;
}

/**
 * Submission
 * 
 * Represents a single submission of an assignment.
 * Contains 0 ... n files, each with 0 ... n entries
 */
 export class Submission implements ISubmission {
    
    /**
     * Builder for Submissions
     */
    static builder = class SubmissionBuilder {
    
        private assignment_id : string;
        private name : string;
        private files : string[];
        private entries : IAnalysisResultEntry[];
    
        constructor() {
            this.name = "Name Not Defined";
            this.assignment_id = "id_not_defined"
            this.files = [];
            this.entries = [];
        }
        
        setName(name : string) : void {
            this.name = name;
        }
        setAssignmentId(id : string) : void {
            this.assignment_id = id;        
        }

        setFiles(files : string[]) : void {
            this.files = files;
        }

        setEntries(entries : IAnalysisResultEntry[]) : void {
            this.entries = entries;
        }
    
        build() : ISubmission {
            var submission = new Submission();
            
            var submissionModel = Submission.getStaticModel();
            var modelInstance = new submissionModel({"assignment_id":this.assignment_id,"name":this.name,"files":this.files,"entries":this.entries});
            
            submission.setId(modelInstance.id);
            submission.setName(this.name);
            submission.setAssignmentId(this.assignment_id);
            submission.setFiles(this.files);
            submission.setEntries(this.entries);
            submission.setModelInstance(modelInstance);
            
            return submission;
         }

         //NOTE: Using buildFromExisting overrides all other builder methods
         buildFromExisting(model : ISubmissionModel) : ISubmission {
             var submission = new Submission();
            
             if(!model.id || !model.name || !model.assignment_id || !model.entries || !model.files) {
                throw new Error("At least one required model property is not present on the provided model");
             }

             submission.setId(model.id);
             submission.setName(model.name);
             submission.setAssignmentId(model.assignment_id);
             submission.setEntries(model.entries);
             submission.setFiles(model.files);
             submission.setModelInstance(model);

             return submission;
         }
    }

    /**
     * Mongoose Schema for Submissions
     */
    private static submissionSchema = new Schema({
        assignment_id: String,
        name: String,
        files: [],
        entries: [Object]
      });

    /**
     * Static Model for Submissions
     */
    private static submissionModel = mongoose.model<ISubmissionModel>('Submission',Submission.submissionSchema);
    
    private id : string;
    private assignment_id : string;
    private name : string;
    private files : string[];
    private entries : IAnalysisResultEntry[];
    private modelInstance : ISubmissionModel;

    protected constructor(){}

    static getStaticModel() :  mongoose.Model<ISubmissionModel> {
        return this.submissionModel;
    }

    getId() : string {
        return this.id;
    }

    getAssignmentId(): string {
         return this.assignment_id;
     }

    getName(): string {
        return this.name;
    }
    
    getFiles() : string[] {
        return this.files;
    }

    getEntries() : IAnalysisResultEntry[] {
        return this.entries;
    }

    protected setId(newId : string) : void {
        this.id = newId;
    }

    protected setModelInstance(modelInstance : ISubmissionModel) {
        this.modelInstance = modelInstance;
    }

    setFiles(files : string[]) : void {
        this.files = files;
    }

    setEntries(entries : IAnalysisResultEntry[]) : void {
        this.entries = entries;
    }

    //Used to initially create new submissions in the database
    getModelInstance() : ISubmissionModel {
        return this.modelInstance;
    }

    setAssignmentId(newId : string): void {
         //TODO: Determine how to refresh/update document when called
         this.assignment_id = newId; 
     }


    setName(newName : string): void {
        //TODO: Determine how to refresh/update document when called
         this.name = newName;
     }

    async addFile(content : string, filePath : string) : Promise<void> {
     
        return new Promise((resolve,reject) => {
            if(this.files.includes(filePath)) {
                reject(new Error("File at " + filePath + " was already added to the submission"));
            } else {
                this.files.push(filePath);
    
                var parseTree = parse(content.toString());
                var visitor = new AnalysisResultEntryCollectorVisitor(filePath,this); 
        
                visitor.visit(parseTree);
        
                visitor.getAnalysisResultEntries().forEach((entry) => { 
                    this.addAnalysisResultEntry(entry);
                 });
    
                 resolve();
            }
        });
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
        return {_id:this.id,assignment_id:this.assignment_id, name:this.name, files:this.files,entries:this.entries};
    }

    compareAnalysisResultEntries(otherEntries : IAnalysisResultEntry[]) : IAnalysisResult {
        
        if(this.entries.length <= 0|| otherEntries.length <= 0) {
            throw new Error("Cannot compare: One or more comparator submissions has no entries");
        }

        var analysisResult = new AnalysisResult();

        this.entries.forEach((entry) => {
            otherEntries.forEach((otherEntry) => {


                //TODO: Update to use actual hash comparison
                //This will include all possible pairings in IAnalysisResult

                //var hashA = entry.getHashValue();
                //var hashB = otherEntry.getHashValue();

                //var comparison = 1;
                //var threshold = 0;

                //if(comparison > threshold) {  
                    analysisResult.addMatch(entry,otherEntry);
                //}
            });
        });

        return analysisResult;
    }
}