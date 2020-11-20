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
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static async readSubmission(submissionId: string): Promise<ISubmission> {
        //Return a single submission with the given submissionId
        return new Promise((resolve,reject) => {
            Submission.getStaticModel().findOne({_id : submissionId}).then((model) => {

                if(model == undefined) {
                    reject(new Error("Cannot find: No submission with the given id exists in the database"));
                } else {
                    var builder = new Submission.builder();
                    var submission = builder.buildFromExisting(model);
                    resolve(submission);
                }
            }).catch((err) => {
                reject(err);
            })
        });
    }

    static async updateSubmission(submission: ISubmission) : Promise<ISubmission> {
        //Update submission model and store all changed properties in the database
        return new Promise((resolve,reject) => {
            Submission.getStaticModel().findOne({_id : submission.getId()}).then((model) => {
                
                if(model == undefined) {
                    reject(new Error("Cannot update: No submission with the given id exists in the database"));
                } else {

                    model.updateOne(
                        {
                            _id : submission.getId() 
                        },
                        {
                            _id : submission.getId(), 
                            name: submission.getName(),
                            assignment_id: submission.getAssignmentId(),
                            files: submission.getFiles(),
                            entries: submission.getEntries()
                        }
                    ).then(() => {
                        model.save().then(() => {
                            resolve(submission);
                        }).catch((err) =>  {
                            reject(err);
                        })
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    static async deleteSubmission(submissionId : string): Promise<ISubmission> {
        //Delete the specified submission from the db
        return new Promise((resolve,reject) => {
            reject(new Error("Not implemented"));
        });
    }
}