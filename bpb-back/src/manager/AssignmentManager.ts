import { IAssignment } from "../model/Assignment";
import { AssignmentDAO } from "../model/AssignmentDAO";
import AssignmentData from "../types/AssignmentData";

/**
 * Represents a controller for Assignment objects.
 */
export interface IAssignmentManager {
    getAssignments() : Promise<IAssignment[]>;
    getAssignment(assignmentId : string) : Promise<IAssignment>;
    createAssignment(data : AssignmentData) : Promise<IAssignment>;
    updateAssignment(assignmentId : string, data : AssignmentData) : Promise<IAssignment>;
    deleteAssignment(assignmentId : string) : Promise<void>;
}

export class AssignmentManager implements IAssignmentManager {

    private assignmentCache : Map<string,IAssignment>;
    private cacheCount : number

    constructor() {
        this.assignmentCache = new Map<string,IAssignment>();
        this.cacheCount = 0;
    }   
    
    createAssignment = async(data : AssignmentData): Promise<IAssignment> => {

        return new Promise((resolve, reject) => {
            var name = data.name;
            var submissionIds = data.submissionIds;

            AssignmentDAO.createAssignment(name, submissionIds)
                .then((assignment) => {
                    this.assignmentCache.set(assignment.getId(), assignment);
                    this.cacheCount++;
                    resolve(assignment);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    getAssignment = async(assignmentId : string) : Promise<IAssignment> => {
        return new Promise((resolve,reject) => {
            
            if(this.assignmentCache.get(assignmentId) != undefined) {
                resolve(this.assignmentCache.get(assignmentId));
            } else {
                AssignmentDAO.readAssignment(assignmentId).then((assignment) => {
                    this.assignmentCache.set(assignmentId, assignment);
                    this.cacheCount++;
                    resolve(assignment);
                }).catch((err) => {
                    reject(err);
                })
            }
        });
    }

    getAssignments = async(): Promise<IAssignment[]> => {

        return new Promise((resolve, reject) => {

            if(this.cacheCount <= 0) {
                AssignmentDAO.readAssignments().then((assignments) => {

                    for(var assignment of assignments) {
                        this.assignmentCache.set(assignment.getId(),assignment);
                        this.cacheCount++;
                    }

                    resolve(assignments);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                var rtnAssignments : IAssignment[] = [];
                for (var assignment of this.assignmentCache.values()) {
                    rtnAssignments.push(assignment);
                }
                resolve(rtnAssignments);
            }
        });
    }

    updateAssignment = async(assignmentId : string, data : AssignmentData) : Promise<IAssignment> => {

        return new Promise((resolve,reject) => {
            
            this.getAssignment(assignmentId).then((assignment) => {

                assignment.setName(data.name);
                assignment.setSubmissionIds(data.submissionIds);

                AssignmentDAO.updateAssignment(assignment).then((updatedAssignment) => {
                    
                    //Note: cache entry will always already exist due to cache set in getAssignment (upstream)
                    //Thus, no cache increment required
                    this.assignmentCache.set(assignmentId,updatedAssignment);

                    resolve(updatedAssignment);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    deleteAssignment = async(assignmentId : string) : Promise<void> => {
        return new Promise((resolve,reject) => {
            this.getAssignment(assignmentId).then(() => {
               
                //Note: cache entry will always already exist due to cache set in getAssignment (upstream)
                this.assignmentCache.delete(assignmentId);
                this.cacheCount--;

               AssignmentDAO.deleteAssignment(assignmentId).then(( )=> {
                    resolve();
               }).catch((err) => {
                    reject(err);
               });
            }).catch((err) => {
                reject(err);
            });
        });
    }
}