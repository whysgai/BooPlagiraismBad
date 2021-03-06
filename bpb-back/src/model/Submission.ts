import mongoose, { Document, Schema } from "mongoose";
import { IAnalysisResult, AnalysisResult } from "./AnalysisResult";
import { AnalysisResultEntry, IAnalysisResultEntry, IAnalysisResultEntryModel } from "./AnalysisResultEntry";
import { AnalysisResultEntryCollectorVisitor } from "./AnalysisResultEntryCollectorVisitor";

import {parse} from 'java-ast'; 
import { Tlsh } from '../lib/tlsh';
import { AppConfig } from "../AppConfig";
import MergeSorter from "../lib/MergeSorter";

/**
 * Represents an Submission database model object
 */
export interface ISubmissionModel extends Document {
    _id : string
    assignment_id : string
    name : string
    files : string[]
    fileContents : string[] 
    entries : [string, IAnalysisResultEntry[]][]
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
    getFileContents() : string[];
    setFileContents(fileContents : string[]) : void;
    setFiles(files : string[]) : void;
    addFile(content : string, fileName : string) : Promise<void>;
    addAnalysisResultEntry(analysisResultEntry : IAnalysisResultEntry) : void;
    compare(otherSubmission : ISubmission) : Promise<IAnalysisResult[]>;
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
        private fileContents : string[];
        private entries : Map<string, IAnalysisResultEntry[]>;
    
        constructor() {
            this.name = "Name Not Defined";
            this.assignment_id = "id_not_defined"
            this.files = [];
            this.fileContents = [];
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
           
            this.files= [];

            for(let file of files) {
                this.files.push(file);
            }
        }
        
        /**
         * Setsthe file contents of the submission 
         * @param fileContents 
         */
        setFileContents(fileContents : string[]) : void {
            
            this.fileContents = [];
            
            for(let fileContent of fileContents) {
                this.fileContents.push(fileContent);
            }
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
            let submission = new Submission();
            
            let submissionModel = Submission.getStaticModel();
            let modelInstance = new submissionModel({"assignment_id":this.assignment_id,"name":this.name,"files":this.files,"fileContents":this.fileContents,"entries":[...this.entries]});
            
            submission.setId(modelInstance.id);
            submission.setName(this.name);
            submission.setAssignmentId(this.assignment_id);
            submission.setFiles(this.files);
            submission.setFileContents(this.fileContents);
            submission.setEntries(this.entries);
            submission.setModelInstance(modelInstance);
            
            return submission;
         }

         /**
          * Builds a Submission from a squashed JSON object (used in Worker)
          * @param object 
          */
         buildFromJson(object : any): ISubmission {

            let submission = new Submission();

            let entryObjects = object.entries as Array<Array<any>>;

            for(let entry of entryObjects) {

                let entries = [] as IAnalysisResultEntry[];

                for(let entryValue of entry[1]) {
                    entries.push(
                        new AnalysisResultEntry(
                        entryValue.id,
                        entryValue.submissionId,
                        entryValue.fileName,
                        entryValue.contextType,
                        entryValue.lineNumberStart,
                        entryValue.charPosStart,
                        entryValue.lineNumberEnd,
                        entryValue.charPosEnd,
                        entryValue.hashValue,
                        entryValue.text
                    ));
                }

                this.entries.set(entry[0],entries);
            }

            submission.setId(object.id);
            submission.setName(object.name);
            submission.setAssignmentId(object.assignment_id);
            submission.setModelInstance(undefined); //NOTE: this is undefined, should not matter
            submission.setFiles(object.files);
            submission.setFileContents(object.fileContents);
            submission.setEntries(this.entries); 

            return submission;
         }

         /**
          * Builds a submission from an existing database model
          * @param model existing model to build from
          * @returns  A submission with the provided data, the provided database model, and the model's id
          */
         buildFromExisting(model : ISubmissionModel) : ISubmission {
             let submission = new Submission();
            
             if(!model.id || !model.name || !model.assignment_id || !model.entries || !model.files || !model.fileContents) {
                throw new Error("At least one required model property is not present on the provided model");
             }

             submission.setId(model.id);
             submission.setName(model.name);
             submission.setAssignmentId(model.assignment_id);
             
             let resultEntries = new Map<string,IAnalysisResultEntry[]>();
             let objectEntries = new Map([...model.entries]);
             
             for(let fileName of objectEntries.keys()) {
                 resultEntries.set(fileName, []);
                 for(let entryObject of objectEntries.get(fileName)) {
                     resultEntries.get(fileName).push(AnalysisResultEntry.buildFromModel(entryObject as object as IAnalysisResultEntryModel));
                 }
             }
             
             submission.setFileContents(model.fileContents);
             submission.setEntries(resultEntries);
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
        files: [String],
        fileContents: [String],
        entries: []
      });

    /**
     * Static Model for Submissions
     */
    private static submissionModel = mongoose.model<ISubmissionModel>('Submission',Submission.submissionSchema);
    
    private id : string;
    private assignment_id : string;
    private name : string;
    private files : string[];
    private fileContents : string[];
    private entries : Map<string, IAnalysisResultEntry[]>;
    private modelInstance : ISubmissionModel;

    protected constructor(){}

    /**
     * Sets the fileContents of the submission
     * @param fileContents new fileContents for the submission
     */
    setFileContents(fileContents: string[]): void {
        this.fileContents = fileContents;
    }

    /**
     * Returns a Map<fileName, fileContent> for fileContents for this submission
     */
    getFileContents(): string[] {
        return this.fileContents;
    }

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
                this.fileContents.push(content); 
    
                let parseTree = parse(content.toString());
                let visitor = new AnalysisResultEntryCollectorVisitor(fileName,this); 
        
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

    /**
     * Compare two submissions
     * @param otherSubmission comparator submission
     * @returns a Promise containing the AnalysisResult
     */
    async compare(otherSubmission: ISubmission) : Promise<IAnalysisResult[]> {

        return new Promise((resolve,reject) => {
            
            if(this.entries.values().next().value == undefined || otherSubmission.getEntries().values().next().value == undefined) {
                reject(new Error("Cannot compare: One or more comparator submissions has no entries"));
            }
    
            let analysisResults = new Array<Promise<IAnalysisResult>>();
    
            for(let subAFileEntries of this.entries.values()) {
                for(let subBFileEntries of otherSubmission.getEntries().values()) {
                    analysisResults.push(this.compareAnalysisResultEntries(subAFileEntries, subBFileEntries));
                }
            }

            //After all results are analysed, sort and return sorted results (ordered by similarity, descending)
            Promise.all(analysisResults).then((analysisResults) => {

                let mergeSorter = new MergeSorter<IAnalysisResult>();
                
                const compareFunction = (s1: IAnalysisResult, s2: IAnalysisResult) : number => { 
                    if(s1.getSimilarityScore() > s2.getSimilarityScore()) { 
                        return -1; 
                    } else if(s2.getSimilarityScore() > s1.getSimilarityScore()){ 
                        return 1; 
                    } else { 
                        return 0
                    } 
                }

                //Apply sort
                mergeSorter.sort(analysisResults,compareFunction);
               
                resolve(analysisResults);

            }).catch((err) => reject(err));
        });
    }
    
    /**
     * Returns the submission as a JSON object
     */
    asJSON() : Object {

        return {_id:this.id,
            assignment_id:this.assignment_id,
            name:this.name,
            files:this.files,
            fileContents:[...this.fileContents],
            entries:[...this.entries] 
        };
    }

    //Used to filter matches
    //Returns false if match is already present in current list
    private includeMatch(currentEntries : Array<Array<IAnalysisResultEntry>>,entryA : IAnalysisResultEntry, entryB : IAnalysisResultEntry) : boolean {
       
        let include = currentEntries.find(it =>
            
                it[0].getLineNumberStart() === entryA.getLineNumberStart() &&

                it[1].getLineNumberStart() === entryB.getLineNumberStart()
            );
       
       if(include !== undefined) {
           return false;
       } else {
           return true;
       }
    }

    private async compareAnalysisResultEntries(fileAEntries : IAnalysisResultEntry[], fileBEntries : IAnalysisResultEntry[]) : Promise<IAnalysisResult> {
       
        return new Promise((resolve,reject) => {

            let matchedEntries = new Array<Array<IAnalysisResultEntry>>();

            let submissionIdA = fileAEntries[0].getSubmissionID();
            let submissionIdB = fileBEntries[0].getSubmissionID();

            let fileNameA = fileAEntries[0].getFileName();
            let fileNameB = fileBEntries[0].getFileName();

            let fileASimilar : boolean[] = [false];
            let fileBSimilar : boolean[] = [false];
            
            let totalMatchedEntries = 0;
            
            for(let i = 0; i < fileAEntries.length; i++) {
                
                for(let j = 0; j < fileBEntries.length; j++) {
                    
                    let hashA = fileAEntries[i].getHashValue();
                    let hashB = fileBEntries[j].getHashValue();

                    let comparison = this.compareHashValues(hashA, hashB);
                    let threshold = AppConfig.comparisonThreshold();

                    if(comparison < threshold) {

                        //Increment total regardless of returned entries
                        totalMatchedEntries++;

                        if(this.includeMatch(matchedEntries,fileAEntries[i],fileBEntries[j])) {
                            matchedEntries.push([fileAEntries[i],fileBEntries[j]]);
                        }

                        fileASimilar[i] = true;
                        fileBSimilar[j] = true;
                    }
                }
            }

            //Generate a similarity score for the AnalysisResult
            let numFileASimilar = fileASimilar.filter(val => val == true).length;
            let numFileBSimilar = fileBSimilar.filter(val => val == true).length;
            let H = totalMatchedEntries;
            let L = fileAEntries.length - numFileASimilar;
            let R = fileBEntries.length - numFileBSimilar;
            let similarityScore = (2 * H) / ((2 * H) + R + L);

            //Sort the matched entries (by longest, descending)
            let mergeSorter = new MergeSorter<IAnalysisResultEntry[]>();

            const compareFunction = (s1: IAnalysisResultEntry[], s2: IAnalysisResultEntry[]) : number => { 
                
                let leftOne = s1[0].getLineNumberEnd() - s1[0].getLineNumberStart();
                let rightOne = s1[1].getLineNumberEnd() - s1[1].getLineNumberStart();
                let avgOne = (leftOne+ rightOne) / 2;

                let leftTwo = s2[0].getLineNumberEnd() - s2[0].getLineNumberStart();
                let rightTwo = s2[1].getLineNumberEnd() - s2[1].getLineNumberStart();
                let avgTwo = (leftTwo+ rightTwo) / 2; 
                
                if(avgOne > avgTwo){ 
                    return -1; 
                } else if(avgTwo > avgOne){ 
                    return 1; 
                } else { 
                    return 0
                } 
            }

            //Apply sort
            mergeSorter.sort(matchedEntries,compareFunction);

            //Apply exclusions
            matchedEntries = matchedEntries.filter(it => !AppConfig.excludedContextTypes()
                .includes(it[0].getContextType()) && !AppConfig.excludedContextTypes().includes(it[1].getContextType()));

            //Remove entries that occur on the same line[s]
            let nonDuplicatedMatchedEntries : IAnalysisResultEntry[][] = new Array<IAnalysisResultEntry[]>();
            matchedEntries.forEach(entryPair => {
                if(nonDuplicatedMatchedEntries.some((it) => {
                    return (it[0].getLineNumberStart() === entryPair[0].getLineNumberStart() &&
                    it[0].getLineNumberEnd() === entryPair[0].getLineNumberEnd()) ||
                    (it[1].getLineNumberStart() === entryPair[1].getLineNumberStart() &&
                    it[1].getLineNumberEnd() === entryPair[1].getLineNumberEnd()) 
                })) {
                    //Do nothing (using else to handle main case for efficency since Array.some() 
                    //will stop iterating over the array if it finds a case and returns true.)
                } else {
                    //If no matching entry is found between entryPair[n] and nonDuplicatedMatchedEntries[n], 
                    //then push to nonDuplicatedMatchedEntries
                    nonDuplicatedMatchedEntries.push(entryPair);
                } 
            });
            //Add only the first n entries to the AnalysisResult
            let reducedMatchedEntries = nonDuplicatedMatchedEntries.slice(0,AppConfig.maxMatchesPerFile());

            //Log that analysis was completed
            //console.log("[BPB] [" + submissionIdA + "][" + submissionIdB + "] Analyzed " + fileNameA + " -> " + fileNameB);

            resolve(new AnalysisResult(reducedMatchedEntries, similarityScore, submissionIdA, submissionIdB, fileNameA, fileNameB));
        });
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