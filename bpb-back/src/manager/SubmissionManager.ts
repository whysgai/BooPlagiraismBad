import { IAnalysisResult } from '../model/AnalysisResult';
import {ISubmission, Submission} from '../model/Submission';
import { ISubmissionDAO, SubmissionDAO } from '../model/SubmissionDAO';
import fs from 'fs';
import util from 'util';
//Promisfy readFile
const readFileContent = util.promisify(fs.readFile);

/**
 * Represents a controller for Submission objects.
 */
export interface ISubmissionManager {
    createSubmission(data : Object) : Promise<ISubmission>;
    getSubmissions(assignmentId : String) : Promise<ISubmission[]>;
    getSubmission(submissionId : String) : Promise<ISubmission>;
    updateSubmission(submissionId : String, data : Object) : Promise<ISubmission>;
    processSubmissionFile(submissionId : String, filePath : String) : Promise<void>; 
    deleteSubmission(submissionId : String) : Promise<void>;
    compareSubmissions(submissionIdA : String, submissionIdB : String) : Promise<IAnalysisResult>
}

export class SubmissionManager implements ISubmissionManager {

    private submissionDAO : ISubmissionDAO;
    private submissionCache : Map<String,ISubmission>;
    
    constructor(submissionDAO : ISubmissionDAO) {
        this.submissionDAO = submissionDAO;
        this.submissionCache = new Map<String,ISubmission>();
    }

    /**
     * Creates a submission with the given data
     * @param data 
     */
    createSubmission = async(data : Object): Promise<ISubmission> => {
        
        //TODO: pull out details from data object and validate
        var name = "test";
        var assignmentId = "testy";

        this.submissionDAO.createSubmission(name,assignmentId)
            .then((submission) => {
                this.submissionCache.set(submission.getId(),submission);
                return Promise.resolve(submission);
        }).catch((err) => {
            return Promise.reject(err);
        });

        return Promise.reject(); //TODO?
    }

    /**
     *  Gets a single submission by id
     * @param submissionId
     */
    getSubmission = async(submissionId : String) : Promise<ISubmission> => {
        
        if(this.submissionCache.get(submissionId)) {
            return Promise.resolve(this.submissionCache.get(submissionId));
        }
        this.submissionDAO.readSubmission(submissionId).then((submission) => {
            return Promise.resolve(submission);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    /**
     *  Gets all submissions of the specified assignment
     * @param assignmentId
     */
    getSubmissions = async(assignmentId : String): Promise<ISubmission[]> => {
        
        //TODO: Update this to use cache
        this.submissionDAO.readSubmissions(assignmentId).then((submissions) => {
            return Promise.resolve(submissions);
        }).catch((err) => {
            return Promise.reject(err);
        });

        return Promise.reject(); //TODO?
    }
    
    /**
     * Updates the specified submission with the provided data
     * @param submissionId 
     * @param data 
     */
    updateSubmission = async(submissionId : String, data : Object): Promise<ISubmission> => {
        //Update the submission in cache and db
        //TODO: pull out details from data object
        var name = "test2"
        var assignmentId = "testy2"

        this.getSubmission(submissionId).then((submission) => {
            submission.setName(name);
            submission.setAssignmentId(assignmentId);
            this.submissionDAO.updateSubmission(submission).then((submission) => {
                this.submissionCache.set(submission.getId(),submission);
                return Promise.resolve(submission);
            }).catch((err) => {
                return Promise.reject(err);
            }) 
        
        }).catch((err) => {
            return Promise.reject(err);
        });

        return Promise.reject(); //TODO?
    }

    /**
     * Processes a submission file and adds entries to the specified submission
     * @param submissionId
     * @param filePath 
     */
    processSubmissionFile = async(submissionId : String, filePath : String): Promise<void> => {

        var path = filePath.toString(); //TODO: use a classier way to primitivize
        
        this.getSubmission(submissionId).then((submission) => {
            readFileContent(path).then((buffer) => {
                var content = buffer.toString();
                submission.addFile(content,filePath).then(() => {
                    this.submissionDAO.updateSubmission(submission).then((updatedSubmission) => {
                        this.submissionCache.set(updatedSubmission.getId(),updatedSubmission);
                        return Promise.resolve();
                    }).catch((err) => {
                        return Promise.reject(err);
                    });
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }).catch((err) => {
                return Promise.reject(err);
            });
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    /**
     * Delete a submission from the cache and database
     * @param submissionId Submission to delete
     */
    deleteSubmission = async(submissionId : String): Promise<void> => {
        if(this.submissionCache.get(submissionId)) {
            this.submissionCache.delete(submissionId);
        }

        this.submissionDAO.deleteSubmission(submissionId).then((submission) => {
            return Promise.resolve(submission);
        }).catch((err) => {
            return Promise.reject(err);
        })
    }
    
    /**
     * Compares two submissions and returns an AnalysisResult of matchings
     * @param submissionIdA 
     * @param submissionIdB 
     */
    compareSubmissions = async(submissionIdA : String, submissionIdB : String): Promise<IAnalysisResult> => {
        this.getSubmission(submissionIdA)
            .then(submissionA => {
                this.getSubmission(submissionIdB)
                    .then(submissionB => {
                        return Promise.resolve(submissionA.compare(submissionB)); //TODO: This is sync
                    }
                ).catch((err) => {
                    return Promise.reject(err);
                });
            }
        ).catch((err) => {
            return Promise.reject(err);
        });

        return Promise.reject(); //TODO?
    }
}