import { IAnalysisResult } from '../model/AnalysisResult';
import {ISubmission, Submission} from '../model/Submission';
import { SubmissionDAO } from '../model/SubmissionDAO';
import fs from 'fs';
import util from 'util';
import SubmissionData from "../types/SubmissionData"
import { AppConfig } from '../AppConfig';
const readFileContent = util.promisify(fs.readFile); //Promisify readfile  to allow use of Promise chaining

class ComparisonCache {
    private analysisResultsCache : Map<string, IAnalysisResult[]>;
    
    constructor() {
        this.analysisResultsCache = new Map<string, IAnalysisResult[]>();
    }

    /**
     * Returns the cached IAnalysisResult[] representing a comparison of the two given submission Id's.
     * Returns undefined if one is not found in the cache.
     * @param subIdA - The Id of one of the relevant submissions.
     * @param subIdB - The Id of one of the relevant submissions.
     */
    get(subIdA : string, subIdB : string) : IAnalysisResult[] {
        return this.analysisResultsCache.get(this.getKey(subIdA, subIdB))
    }

    /**
     * Stores an IAnalysisResult[] representing a comparison of two provided submission Id's in the cache. 
     * @param subIdA - The Id of one of the relevant submissions.
     * @param subIdB - The Id of one of the relevant submissions.
     * @param analysisResults - The IAnalysisResult[] that we are storing in the cache.
     */
    set(subIdA : string, subIdB : string, analysisResults : IAnalysisResult[]) {
        this.analysisResultsCache.set(this.getKey(subIdA, subIdB), analysisResults);
    }

    /**
     * Removes all comparisons related to a given submission from the cache.
     * @param subId - The Id of the relevant submission.
     */
    delete(subId : string) {
        for(let key of this.analysisResultsCache.keys()) {
            if(key.substr(0, key.length/2) == subId || key.substr(key.length/2, key.length/2) == subId) {
                this.analysisResultsCache.delete(key);
            }
        }
    }

    /**
     * Creates a unique key, using the two unique submissionId's provided.
     * @param subIdA 
     * @param subIdB 
     */
    private getKey(subIdA : string, subIdB : string) : string {
        if(subIdA < subIdB) {
            return subIdA + subIdB;
        } else { //Essentially works out to be subIdA > subIdB, since both id's are unique, they will never be equal
            return subIdB + subIdA;
        }
    }
}

/**
 * Represents a controller for Submission objects.
 * Is called by SubmissionRouter to access Submission objects
 * Calls SubmissionDAO to persist Submission objects in the database
 */
export interface ISubmissionManager {
    createSubmission(data : SubmissionData) : Promise<ISubmission>;
    getSubmissions(assignmentId : string) : Promise<ISubmission[]>;
    getSubmission(submissionId : string) : Promise<ISubmission>;
    updateSubmission(submissionId : string, data : SubmissionData) : Promise<ISubmission>;
    processSubmissionFile(submissionId : string, fileName : string) : Promise<void>; 
    deleteSubmission(submissionId : string) : Promise<void>;
    compareSubmissions(submissionIdA : string, submissionIdB : string) : Promise<IAnalysisResult[]>
    getSubmissionFileContent(submissionId : string, fileName : string) : Promise<string>
}

export class SubmissionManager implements ISubmissionManager {

    private submissionCache : Map<string,ISubmission>;
    private fileContentsCache : Map<string, Map<string, string>>; // <submissionId, <fileName, fileContent>>
    private submissionCacheByAssignment : Map<string, ISubmission[]>;
    private comparisonCache : ComparisonCache;
    
    constructor() {
        this.submissionCache = new Map<string,ISubmission>();
        this.fileContentsCache = new Map<string, Map<string, string>>();
        this.submissionCacheByAssignment = new Map<string, ISubmission[]>();
        this.comparisonCache = new ComparisonCache();
    }

    /**
     * Creates a submission with the given SubmissionData
     * @param data 
     * @returns A Promise containing the created Submission
     */
    createSubmission = async(data : SubmissionData): Promise<ISubmission> => {
        
        return new Promise((resolve,reject) => {
            var name = data.name;
            var assignmentId = data.assignmentId;
    
            SubmissionDAO.createSubmission(name,assignmentId)
                .then((submission) => {
                    this.submissionCache.set(submission.getId(),submission);
                    resolve(submission);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Gets a reference to a Submission with the given id (if one exists)
     * @param submissionId
     * @returns A Promise containing the requested Submission
     */
    getSubmission = async(submissionId : string) : Promise<ISubmission> => {
        return new Promise((resolve, reject) => {

            //Read from cache if entry exists in cache
            if(this.submissionCache.get(submissionId) != undefined) {
                resolve(this.submissionCache.get(submissionId));
            } else {
                //Read from database if cache entry does not exist
                SubmissionDAO.readSubmission(submissionId).then((submission) => {
                    this.submissionCache.set(submissionId,submission);
                    resolve(submission);
                }).catch((err) => {
                    reject(err);
                });    
            }
        });
    }

    /**
     *  Gets all submissions of the specified assignment (by id)
     * @param assignmentId
     * @returns A Promise containing all Submissions of the specified assignment, if any exist. Will return an empty list otherwise.
     */
    getSubmissions = async(assignmentId : string): Promise<ISubmission[]> => {
        return new Promise((resolve, reject) => {
            if(this.submissionCacheByAssignment.get(assignmentId) != undefined) {
                resolve(this.submissionCacheByAssignment.get(assignmentId));
            } else {
                SubmissionDAO.readSubmissions(assignmentId).then((submissions) => {
                    this.submissionCacheByAssignment.set(assignmentId, submissions);
                    submissions.forEach(submission => {
                        //Populate the other cache as well
                        this.submissionCache.set(submission.getId(), submission);
                    });
                    resolve(submissions);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }
    
    /**
     * Updates the specified submission with the provided data
     * @param submissionId 
     * @param data 
     * @returns A Promise containing the updated Submission
     */
    updateSubmission = async(submissionId : string, data : SubmissionData): Promise<ISubmission> => {
        
        return new Promise((resolve,reject) => {
            var name = data.name;
            var assignmentId = data.assignmentId;
    
            this.getSubmission(submissionId).then((submission) => {
                submission.setName(name);
                submission.setAssignmentId(assignmentId);
                SubmissionDAO.updateSubmission(submission).then((submission) => {
                    //submisionCache
                    this.submissionCache.set(submissionId,submission);
                    //submissionCacheByAssignment
                    if(this.submissionCacheByAssignment.get(submission.getAssignmentId()) != undefined) {
                        for(let subInCache of this.submissionCacheByAssignment.get(submission.getAssignmentId())) {
                            if(subInCache.getId() === submissionId) {
                                subInCache = submission;
                            }
                        }
                    }
                    //ComparisonCache
                    this.comparisonCache.delete(submissionId); //TODO: determine if necessary (will a file be deleted?)
                    //fileContentsCache
                    if(this.fileContentsCache.get(submissionId) != undefined) {}//TODO: determine if this is necessary (will a file be deleted)
                    resolve(submission);
                }).catch((err) => {
                   reject(err);
                }) 
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Adds the specified file to the submission
     * @param submissionId Id of the submission to add a file  to
     * @param fileName Name of the file to add (file must exist at AppConfig.submissionFileUploadDirectory/submissionid/filename)
     * @returns An empty Promise
     */
    processSubmissionFile = async(submissionId : string, fileName : string): Promise<void> => {

        return new Promise((resolve,reject) => {

            this.getSubmission(submissionId).then((submission) => {
                readFileContent(AppConfig.submissionFileUploadDirectory() + submissionId + "/" + fileName).then((buffer) => {
                    var content = buffer.toString();
                    submission.addFile(content,fileName).then(() => {
                        SubmissionDAO.updateSubmission(submission).then((updatedSubmission) => {
                            //submissionCache
                            this.submissionCache.set(updatedSubmission.getId(),updatedSubmission);
                            //fileContentsCache
                            if(this.fileContentsCache.get(submissionId) != undefined) {
                                this.fileContentsCache.get(submissionId).set(fileName, content);
                            } else {
                                this.fileContentsCache.set(submissionId, new Map<string, string>().set(fileName, content));
                            }
                            //comparisonCache
                            this.comparisonCache.delete(submissionId); //Since a new file has been introduced, need to re-compare
                            //submissionCacheByAssignment
                            if(this.submissionCacheByAssignment.get(submission.getAssignmentId()) != undefined) {
                                for(let subInCache of this.submissionCacheByAssignment.get(submission.getAssignmentId())) {
                                    if(subInCache.getId() === submissionId) {
                                        subInCache = updatedSubmission;
                                    }
                                }
                            }
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Delete a submission from the cache and database
     * @param submissionId Submission to delete
     * @returns An empty Promise
     */
    deleteSubmission = async(submissionId : string): Promise<void> => {

        return new Promise((resolve,reject) => {

            //Ensure submission exists before deletion
            this.getSubmission(submissionId).then((submission) => {
                
                if(this.submissionCache.get(submissionId) != undefined) {
                    this.submissionCache.delete(submissionId);
                }

                if(this.fileContentsCache.get(submissionId) != undefined) {
                    this.fileContentsCache.delete(submissionId);
                }

                if(this.submissionCacheByAssignment.get(submission.getAssignmentId()) != undefined) {
                    this.submissionCacheByAssignment.set(submission.getAssignmentId(), 
                        this.submissionCacheByAssignment.get(submission.getAssignmentId())
                            .filter((submission) => submission.getId() != submissionId));
                }
                
                this.comparisonCache.delete(submissionId);
        
                SubmissionDAO.deleteSubmission(submissionId).then((submission) => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
    }
    
    /**
     * Compares two submissions and returns the result of the comparative analysis
     * @param submissionIdA Submission A's Id
     * @param submissionIdB Submission B's Id
     * @returns A Promise containing the result of the comparison as an AnalysisResult
     */
    compareSubmissions = async(submissionIdA : string, submissionIdB : string) : Promise<IAnalysisResult[]> => {

        return new Promise((resolve,reject) => {
            if(this.comparisonCache.get(submissionIdA, submissionIdB) != undefined) {
                resolve(this.comparisonCache.get(submissionIdA, submissionIdB));
            } else {
                this.getSubmission(submissionIdA)
                .then(submissionA => {
                    this.getSubmission(submissionIdB)
                        .then(submissionB => {
                            let analysisResults = submissionA.compare(submissionB)
                            this.comparisonCache.set(submissionIdA, submissionIdB, analysisResults)
                            resolve(submissionA.compare(submissionB)); 
                        resolve(submissionA.compare(submissionB)); 
                            resolve(submissionA.compare(submissionB)); 
                        }
                    ).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }

    /**
     * Obtains and returns the content of the specified submission file as a string
     * @param submissionId Submission to check
     * @param fileName Name of the submission file to retrieve content from
     * @returns a Promise containing the file's content as a string
     */
    getSubmissionFileContent = async(submissionId : string, fileName : string) : Promise<string> => {
        
        return new Promise((resolve,reject) => {
            if(this.fileContentsCache.get(submissionId) != undefined 
            && this.fileContentsCache.get(submissionId).get(fileName) != undefined) {
                resolve(this.fileContentsCache.get(submissionId).get(fileName));
            } else {
                this.getSubmission(submissionId).then((submission) => {
                    readFileContent(AppConfig.submissionFileUploadDirectory() + submissionId + "/" + fileName).then((buffer) => {
                        var content = buffer.toString();
                        if(this.fileContentsCache.get(submissionId) == undefined) {
                            this.fileContentsCache.set(submissionId, new Map<string, string>());
                        }
                        this.fileContentsCache.get(submissionId).set(fileName, content);
                        resolve(content);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }
}