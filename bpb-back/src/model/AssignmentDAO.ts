import {IAssignment, Assignment } from './Assignment'

export interface IAssignmentDAO {
    createAssignment(name : string) : Promise<IAssignment>; 
    readAssignments() : Promise<IAssignment[]>;
    readAssignment(assignmentId : string) : Promise<IAssignment>;
    updateAssignment(assignment : IAssignment) : Promise<IAssignment>;
    deleteAssignment(assignmentId : string) : Promise<void>;
}
/**
 * Data Access static class for manipulating Assignment database objects.
 */
export const AssignmentDAO : IAssignmentDAO = class {
    
    /**
     * Creates an assignment with the given name
     * @param name 
     * @returns A Promise containing the created Assignment
     */
    static async createAssignment(name : string): Promise<IAssignment> {
        return new Promise((resolve,reject) => {
            
            let assignmentBuilder = new Assignment.builder();
            assignmentBuilder.setName(name);
            
            let assignment = assignmentBuilder.build();

            let assignmentModel = assignment.getModelInstance();

            assignmentModel.save().then(() => {
                resolve(assignment);
            }).catch((err) => {
                reject(err);
            });
       });
    }
    
    /**
     * Obtains all Assignments from the database
     * @returns A Promise containing all Assignments in the databse
     */
    static async readAssignments(): Promise<IAssignment[]> {
        
        return new Promise((resolve,reject) => {
            Assignment.getStaticModel().find().then((assignmentModels) => {

                Promise.all(
                    assignmentModels.map(
                        model => {
                            return new Assignment.builder().buildFromExisting(model);
                        }
                    )
                ).then(assignment => {
                    resolve(assignment);
                }); //NOTE: Removed catch (should be caught downsteam in chain)
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Obtains the specified assignment from the database
     * @param AssignmentId Id of the assignment to obtain
     * @returns A Promise containing the requested assignment, if it exists
     */
    static async readAssignment(assignmentId: string): Promise<IAssignment> {

        return new Promise((resolve,reject) => {
            Assignment.getStaticModel().findOne({_id : assignmentId}).then((model) => {

                if(model == undefined) {
                    reject(new Error("Cannot find: No assignment with the given id exists in the database"));
                } else {
                    let builder = new Assignment.builder();
                    let assignment = builder.buildFromExisting(model);
                    resolve(assignment);
                }
            }).catch((err) => {
                reject(err);
            })
        });
    }

    /**
     * Updates the database records which match the specified assignment to match the specified assignment's data
     * @param assignment Assignment to update
     * @returns A Promise containing the updated Assignment
     */
    static async updateAssignment(assignment : IAssignment) : Promise<IAssignment> {

        return new Promise((resolve,reject) => {
            Assignment.getStaticModel().findOne({_id : assignment.getId()}).then((model) => {
                
                if(model == undefined) {
                    reject(new Error("Cannot update: No assignment with the given id exists in the database"));
                } else {

                    Assignment.getStaticModel().findOneAndUpdate(
                        {
                            _id : assignment.getId() 
                        },
                        {
                            _id : assignment.getId(), 
                            name : assignment.getName()                        },
                        {
                            new:true
                        }
                    ).then((res) => {
                        resolve(assignment);
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
     * Deletes the specified assignment from the database
     * @param assignmentId Assignment to delete
     * @returns A Promise containing nothing
     */
    static async deleteAssignment(assignmentId : string): Promise<void> {
        
        return new Promise((resolve,reject) => {
            return Assignment.getStaticModel().findOne({_id : assignmentId}).then((model) => {                
                if(model == undefined) {
                    reject(new Error("Cannot delete: No assignment with the given id exists in the database"));
                } else {
                    return Assignment.getStaticModel().findOneAndDelete(
                        {
                            _id : assignmentId 
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