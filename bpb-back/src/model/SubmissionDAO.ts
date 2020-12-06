import {ISubmission, Submission} from './Submission'

export interface ISubmissionDAO {
    createSubmission(name : string, assignment_id : string) : Promise<ISubmission>; 
    readSubmissions(assignmentId : string) : Promise<ISubmission[]>;
    readSubmission(submissionId : string) : Promise<ISubmission>;
    updateSubmission(submission : ISubmission) : Promise<ISubmission>;
    deleteSubmission(submissionId : string) : Promise<void>;
}
/**
 *  Data Access static class for manipulating Submission database objects.
 */

export const SubmissionDAO : ISubmissionDAO = class {
    
    static async createSubmission(name : string, assignmentId : string): Promise<ISubmission> {
       
        return new Promise((resolve,reject) => {
            
            let submissionBuilder = new Submission.builder();
            submissionBuilder.setName(name);
            submissionBuilder.setAssignmentId(assignmentId);
            
            let submission = submissionBuilder.build();

            let submissionModel = submission.getModelInstance();

            submissionModel.save().then(() => {
                resolve(submission);
            }).catch((err) => {
                reject(err);
            });
       });
    }

    /**
     * Obtain all submissions of the specified assignment from the  database
     * @param assignmentId assignment to query
     * @returns a Promise containing all submissions of the specified assignment, if any exist
     */
    static async readSubmissions(assignmentId : string): Promise<ISubmission[]> {
        return new Promise((resolve,reject) => {
            Submission.getStaticModel().find({assignment_id : assignmentId}).then((submissionModels) => {

                Promise.all(
                    submissionModels.map(
                        model => {
                            return new Submission.builder().buildFromExisting(model);
                        }
                    )
                ).then(submissions => {
                    resolve(submissions);
                }); //NOTE: Removed catch (should be caught downsteam in chain)
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Obtain a single submission from the database by id
     * @param submissionId id of submission
     * @returns a Promise containing the specified submission, if it exists
     */
    static async readSubmission(submissionId: string): Promise<ISubmission> {
        return new Promise((resolve,reject) => {
            Submission.getStaticModel().findOne({_id : submissionId}).then((model) => {

                if(model == undefined) {
                    reject(new Error("Cannot find: No submission with the given id exists in the database"));
                } else {
                    let builder = new Submission.builder();
                    let submission = builder.buildFromExisting(model);
                    resolve(submission);
                }
            }).catch((err) => {
                reject(err);
            })
        });
    }

    /**
     * Updates the database records which match the specified submission to match the specified submission's data
     * @param submission Submission to update
     * @returns A Promise containing the updated Submission 
     */
    static async updateSubmission(submission: ISubmission) : Promise<ISubmission> {
        return new Promise((resolve,reject) => {
            Submission.getStaticModel().findOne({_id : submission.getId()}).then((model) => {
                
                if(model == undefined) {
                    reject(new Error("Cannot update: No submission with the given id exists in the database"));
                } else {

                    Submission.getStaticModel().findOneAndUpdate(
                        {
                            _id : submission.getId() 
                        },
                        {
                            _id : submission.getId(), 
                            name: submission.getName(),
                            assignment_id: submission.getAssignmentId(),
                            files: submission.getFiles(),
                            fileContents: submission.getFileContents(),
                            entries: [...submission.getEntries()]
                        },
                        {
                            new:true
                        }
                    ).then((res) => {
                        resolve(submission);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
   
    /**
     * Delete the specified submission from the database
     * @param submissionId 
     */
    static async deleteSubmission(submissionId : string): Promise<void> {
        //Delete the specified submission from the db
        return new Promise((resolve,reject) => {
            return Submission.getStaticModel().findOne({_id : submissionId}).then((model) => {                
                if(model == undefined) {
                    reject(new Error("Cannot delete: No submission with the given id exists in the database"));
                } else {
                    return Submission.getStaticModel().findOneAndDelete(
                        {
                            _id : submissionId 
                        }
                    ).then((res) => {
                        resolve();
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });            
        });
    }
}