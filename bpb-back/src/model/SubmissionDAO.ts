import {ISubmission, Submission} from './Submission'

export interface ISubmissionDAO {
    createSubmission(name : string, assignment_id : string) : Promise<ISubmission>; 
    readSubmissions(assignmentId : string) : Promise<ISubmission[]>;
    readSubmission(submissionId : string) : Promise<ISubmission>;
    updateSubmission(submission : ISubmission) : Promise<ISubmission>;
    deleteSubmission(submissionId : string) : Promise<ISubmission>;
}
/**
 *  Data Access static class for manipulating Submission database objects.
 */

export const SubmissionDAO : ISubmissionDAO = class {
    
    static async createSubmission(name : string, assignmentId : string): Promise<ISubmission> {
       
        return new Promise((resolve,reject) => {
            
            var submissionBuilder = new Submission.builder();
            submissionBuilder.setName(name);
            submissionBuilder.setAssignmentId(assignmentId);
            
            var submission = submissionBuilder.build();

            var submissionModel = submission.getModelInstance();

            submissionModel.save().then(() => {
                resolve(submission);
            }).catch((err) => {
                reject(err);
            });
       });
    }
 
    static async readSubmissions(assignmentId : string): Promise<ISubmission[]> {
        //Return all submissions of assignment
        return new Promise((resolve,reject) => {
            Submission.getStaticModel().find({assignment_id : assignmentId}).then((submissionModels) => {

                if(submissionModels.length == 0) {
                    reject(new Error("Cannot find: No submissions with the given assignment id exist in the database"));
                } else {
                    Promise.all(submissionModels.map( model => { 
                        var builder = new Submission.builder();
                        return builder.buildFromExisting(model);
                     })).then(submissions => {
                         resolve(submissions);
                     });
                }
            })
        });
    }

    static async readSubmission(submissionId: string): Promise<ISubmission> {
        //Return submission and all of its AnalysisResultEntries
        return new Promise((resolve,reject) => {
            reject(new Error("Not implemented"));
        });
    }

    static async updateSubmission(submission: ISubmission) : Promise<ISubmission> {
        //Add any new not-persisted AnalysisResultEntries into the database
        return new Promise((resolve,reject) => {
            reject(new Error("Not implemented"));
        });
    }
    
    static async deleteSubmission(submissionId : string): Promise<ISubmission> {
        //Delete the specified submission from the db
        return new Promise((resolve,reject) => {
            reject(new Error("Not implemented"));
        });
    }
}