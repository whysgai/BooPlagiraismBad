import mongoose, { Document, Schema } from "mongoose";
import { IAnalysisResult, AnalysisResult } from "./AnalysisResult";
import { AnalysisResultEntry, IAnalysisResultEntry } from "./AnalysisResultEntry";
import { AnalysisResultEntryCollectorVisitor } from "./AnalysisResultEntryCollectorVisitor";

import {parse} from 'java-ast'; 
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
import { AppConfig } from "../AppConfig";

/**
 * Represents an Submission database model object
 */
export interface ISubmissionModel extends Document {
    _id : string
    assignment_id : string
    name : string
    files : string[]
    entries : Map<string, IAnalysisResultEntry[]>
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
    getEntries() : Map<string, IAnalysisResultEntry[]>;
    setEntries(entries: Map<string, IAnalysisResultEntry[]>) :void;
    getModelInstance() : ISubmissionModel;
    getFiles() : string[];
    setFiles(files : string[]) : void;
    addFile(content : string, fileName : string) : Promise<void>;
    addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry) : void;
    compare(otherSubmission : ISubmission) : IAnalysisResult[];
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
        private entries : Map<string, IAnalysisResultEntry[]>;
    
        constructor() {
            this.name = "Name Not Defined";
            this.assignment_id = "id_not_defined"
            this.files = [];
            this.entries = new Map<string, IAnalysisResultEntry[]>();
        }
       
        /**
         * Sets the name of the Submission to be created
         * @param name 
         */
        setName(name : string) : void {
            this.name = name;
        }

        /**
         * Sets the assignment the Submission was made to (by id)
         * @param id 
         */
        setAssignmentId(id : string) : void {
            this.assignment_id = id;        
        }

        /**
         * Sets the  file names associated with the submission
         * @param files 
         */
        setFiles(files : string[]) : void {
            this.files = files;
        }

        /**
         * Sets the AnalysisResultEntries associated with the submission
         * @param entries 
         */
        setEntries(entries : Map<string, IAnalysisResultEntry[]>) : void {
            this.entries = entries;
        }
    
        /**
         * Builds a Submission with the provided inputs, sets a database model instance and Id
         * @returns a new Submission with the provided data, new database model, and corresponding Id
         */
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

         /**
          * Builds a submission from an existing database model
          * @param model existing model to build from
          * @returns  A submission with the provided data, the provided database model, and the model's id
          */
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
        entries: Map
      });

    /**
     * Static Model for Submissions
     */
    private static submissionModel = mongoose.model<ISubmissionModel>('Submission',Submission.submissionSchema);
    
    private id : string;
    private assignment_id : string;
    private name : string;
    private files : string[];
    private entries : Map<string, IAnalysisResultEntry[]>
    private modelInstance : ISubmissionModel;

    protected constructor(){}

    /**
     * Returns the static database model for submissions
     * @returns static database model
     */
    static getStaticModel() :  mongoose.Model<ISubmissionModel> {
        return this.submissionModel;
    }

    /**
     * Returns the id of the submission
     */
    getId() : string {
        return this.id;
    }

    /**
     * Returns the assignment id of the submission
     */
    getAssignmentId(): string {
         return this.assignment_id;
     }

    /**
     * Returns the name of the submission
     */
    getName(): string {
        return this.name;
    }
    
    /**
     * Returns all file names associated with the submission
     */
    getFiles() : string[] {
        return this.files;
    }

    /**
     * Returns all entries associated with the submission
     */
    getEntries() : Map<string, IAnalysisResultEntry[]> {
        return this.entries;
    }

    /**
     * Sets the id of the submission. Called by SubmissionBuilder.
     * @param newId id to set
     */
    protected setId(newId : string) : void {
        this.id = newId;
    }

    /**
     * Sets the database model of the submission. Called by SubmissionBuilder.
     * @param modelInstance model instance to set
     */
    protected setModelInstance(modelInstance : ISubmissionModel) {
        this.modelInstance = modelInstance;
    }

    /**
     * Sets the filenames associated with the submission
     * @param files file names (as a string list)
     */
    setFiles(files : string[]) : void {
        this.files = files;
    }

    /**
     * Sets the entries associated with the submission
     * @param entries AnalysisResultEntries associated with the submission
     */
    setEntries(entries : Map<string, IAnalysisResultEntry[]>) : void {
        this.entries = entries;
    }
    
    /**
     * Returns the database model instance for this submission
     * @returns instance of the database model from this submission
     */
    getModelInstance() : ISubmissionModel {
        return this.modelInstance;
    }

    /**
     * Sets the assignment id of the submission
     * @param newId 
     */
    setAssignmentId(newId : string): void {
         this.assignment_id = newId; 
     }

     /**
      * Sets the name of the submission
      * @param newName 
      */
    setName(newName : string): void {
         this.name = newName;
     }

     /**
      * Adds a file's content to the submission
      * Parses the specified file content and adds AnalysisResultEntries to the submission from parsing results
      * @param content File content to parse (string)
      * @param fileName Name of the file which is being parsed
      * @return an empty Promise
      */
    async addFile(content : string, fileName : string) : Promise<void> {
     
        return new Promise((resolve,reject) => {
            if(this.files.includes(fileName)) {
                reject(new Error("Submission file " + fileName + " was already added to the submission"));
            } else {
                this.files.push(fileName);
    
                var parseTree = parse(content.toString());
                var visitor = new AnalysisResultEntryCollectorVisitor(fileName,this); 
        
                visitor.visit(parseTree);
        
                visitor.getAnalysisResultEntries().forEach((entry) => { 
                    this.addAnalysisResultEntry(entry);
                 });
                 resolve();
            }
        });
    }

    /**
     * Add a single entry to the submission
     * @param analysisResultEntry entry to add
     */
    addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry): void {
        let entryArray = this.entries.get(analysisResultEntry.getFileName());
        if(entryArray == undefined) {
            this.entries.set(analysisResultEntry.getFileName(), []);
            entryArray = this.entries.get(analysisResultEntry.getFileName());
        }
        entryArray.push(analysisResultEntry);
        if(!(this.files.includes(analysisResultEntry.getFileName()))) {
            this.files.push(analysisResultEntry.getFileName());
        }
    }

    compare(otherSubmission: ISubmission) : IAnalysisResult[] {
        if(this.entries.values().next().value == undefined || otherSubmission.getEntries().values().next().value == undefined) {
            throw new Error("Cannot compare: One or more comparator submissions has no entries");
        }
        let analysisResults = new Array<IAnalysisResult>();
        for(let subAFileEntries of this.entries.values()) {
            for(let subBFileEntries of otherSubmission.getEntries().values()) {
                analysisResults.push(this.compareAnalysisResultEntries(subAFileEntries, subBFileEntries));
            }
        }
        return analysisResults;
    }

    /**
     * Returns the submission as a JSON object
     */
    asJSON() : Object {
        return {_id:this.id,
            assignment_id:this.assignment_id,
            name:this.name,
            files:this.files,
            entries:[...this.entries] // When parsing json object, this can be converted back to a Map with: entries = new Map(JSONObject["entries"]);
        };
    }

    private compareAnalysisResultEntries(fileAEntries : IAnalysisResultEntry[], fileBEntries : IAnalysisResultEntry[]) : IAnalysisResult {
        

        
        let matchedEntries = new Array<Array<IAnalysisResultEntry>>();
        let fileASimilar : boolean[] = [false];
        let fileBSimilar : boolean[] = [false];
        for(let i = 0; i < fileAEntries.length; i++) {
            for(let j = 0; j < fileBEntries.length; j++) {
                let hashA = fileAEntries[i].getHashValue();
                let hashB = fileBEntries[j].getHashValue();

                let comparison = this.compareHashValues(hashA, hashB);
                var threshold = AppConfig.getComparisonThreshold(); //TODO: determine actual threshold, using 100 for now

                if(comparison < threshold) {  //the more similar a comparison, the lower the number
                    matchedEntries.push([fileAEntries[i],fileBEntries[j]]);
                    fileASimilar[i] = true;
                    fileBSimilar[j] = true;
                }
            }
        }
        let numFileASimilar = fileASimilar.filter(val => val == true).length;
        let numFileBSimilar = fileBSimilar.filter(val => val == true).length;

        let H = matchedEntries.length;
        let L = fileAEntries.length - numFileASimilar;
        let R = fileBEntries.length - numFileBSimilar;
        let similarityScore = (2 * H) / ((2 * H) + R + L); //DECKARD SIMILARITY SCORE ALGORITHM

        let submissionIdA = fileAEntries[0].getSubmissionID();
        let submissionIdB = fileBEntries[0].getSubmissionID();
        let fileNameA = fileAEntries[0].getFileName();
        let fileNameB = fileBEntries[0].getFileName();
        var analysisResult = new AnalysisResult(matchedEntries, similarityScore, submissionIdA, submissionIdB, fileNameA, fileNameB);
        return analysisResult;
    }

    /**
     * Compares two entry hash values and produces a result
     * @param hashA 
     * @param hashB 
     */
    private compareHashValues(hashA : string, hashB : string) : number {
        let tlshA = new Tlsh();
        tlshA.fromTlshStr(hashA);
        let tlshB = new Tlsh();
        tlshB.fromTlshStr(hashB);
        return tlshA.totalDiff(tlshB, false);
    }
}