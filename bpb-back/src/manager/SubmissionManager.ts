import { IAnalysisResult } from '../model/AnalysisResult';
import {ISubmission, Submission} from '../model/Submission';
import { SubmissionDAO } from '../model/SubmissionDAO';
import fs from 'fs';
import util from 'util';
import SubmissionData from "../types/SubmissionData"
//Promisfy readFile
const readFileContent = util.promisify(fs.readFile);

/**
 * Represents a controller for Submission objects.
 */
export interface ISubmissionManager {
    createSubmission(data : SubmissionData) : Promise<ISubmission>;
    getSubmissions(assignmentId : string) : Promise<ISubmission[]>;
    getSubmission(submissionId : string) : Promise<ISubmission>;
    updateSubmission(submissionId : string, data : SubmissionData) : Promise<ISubmission>;
    processSubmissionFile(submissionId : string, filePath : string) : Promise<void>; 
    deleteSubmission(submissionId : string) : Promise<void>;
    compareSubmissions(submissionIdA : string, submissionIdB : string) : Promise<IAnalysisResult>
    getSubmissionFileContent(submissionId : string, filePath : string) : Promise<string>
}

export class SubmissionManager implements ISubmissionManager {

    private submissionCache : Map<string,ISubmission>;
    
    constructor() {
        this.submissionCache = new Map<string,ISubmission>();
    }

    /**
     * Creates a submission with the given data
     * @param data 
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
     *  Gets a single submission by id
     * @param submissionId
     */
    getSubmission = async(submissionId : string) : Promise<ISubmission> => {
        return new Promise((resolve, reject) => {

            if(this.submissionCache.get(submissionId) != undefined) {
                resolve(this.submissionCache.get(submissionId));
            } else {
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
     *  Gets all submissions of the specified assignment
     * @param assignmentId
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
     * Processes a submission file and adds entries to the specified submission
     * @param submissionId
     * @param filePath 
     */
    processSubmissionFile = async(submissionId : string, filePath : string): Promise<void> => {

        return new Promise((resolve,reject) => {

            this.getSubmission(submissionId).then((submission) => {
                readFileContent(filePath).then((buffer) => {
                    var content = buffer.toString();
                    submission.addFile(content,filePath).then(() => {
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
     * Compares two submissions and returns an AnalysisResult of matchings
     * @param submissionIdA 
     * @param submissionIdB 
     */
    compareSubmissions = async(submissionIdA : string, submissionIdB : string) : Promise<IAnalysisResult> => {

        return new Promise((resolve,reject) => {
            this.getSubmission(submissionIdA)
            .then(submissionA => {
                this.getSubmission(submissionIdB)
                    .then(submissionB => {
                        resolve(submissionA.compare(submissionB)); //TODO: This is synchronous
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
     */
    getSubmissionFileContent = async(submissionId : string, filePath : string) : Promise<string> => {
        return new Promise((resolve,reject) => {
            //TODO
            reject(new Error("Not yet implemented"));
        });
    }
}