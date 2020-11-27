import { IAnalysisResult } from '../model/AnalysisResult';
import {ISubmission, Submission} from '../model/Submission';
import { SubmissionDAO } from '../model/SubmissionDAO';
import fs from 'fs';
import util from 'util';
import SubmissionData from "../types/SubmissionData"
import { AppConfig } from '../AppConfig';
const readFileContent = util.promisify(fs.readFile); //Promisify readfile  to allow use of Promise chaining

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
    compareSubmissions(submissionIdA : string, submissionIdB : string) : Promise<IAnalysisResult>
    getSubmissionFileContent(submissionId : string, fileName : string) : Promise<string>
}

export class SubmissionManager implements ISubmissionManager {

    private submissionCache : Map<string,ISubmission>;
    
    constructor() {
        this.submissionCache = new Map<string,ISubmission>();
    }

    /**
     * Creates a submission with the given SubmissionData
     * @param data 
     * @returns A Promise containing the created Submission
     */
    createSubmission = async(data : SubmissionData): Promise<ISubmission> => {
        
        return new Promise((resolve,reject) => {
            var name = data.name;
            var assignmentId = data.assignment_id;
    
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
        //TODO: Update to use cache
        return new Promise((resolve, reject) => {
            SubmissionDAO.readSubmissions(assignmentId).then((submissions) => {
                resolve(submissions);
            }).catch((err) => {
                reject(err);
            });
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
            var assignmentId = data.assignment_id;
    
            this.getSubmission(submissionId).then((submission) => {
                submission.setName(name);
                submission.setAssignmentId(assignmentId);
                SubmissionDAO.updateSubmission(submission).then((submission) => {
                    this.submissionCache.set(submission.getId(),submission);
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
                            this.submissionCache.set(updatedSubmission.getId(),updatedSubmission);
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
    compareSubmissions = async(submissionIdA : string, submissionIdB : string) : Promise<IAnalysisResult> => {

        return new Promise((resolve,reject) => {
            this.getSubmission(submissionIdA)
            .then(submissionA => {
                this.getSubmission(submissionIdB)
                    .then(submissionB => {
                        resolve(submissionA.compare(submissionB)); 
                    }
                ).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
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

            this.getSubmission(submissionId).then((submission) => {
                readFileContent(AppConfig.submissionFileUploadDirectory() + submissionId + "/" + fileName).then((buffer) => {
                    var content = buffer.toString();
                    resolve(content);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}