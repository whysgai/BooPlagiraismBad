import { IAssignment } from "../model/Assignment";
import { AssignmentDAO } from "../model/AssignmentDAO";
import AssignmentData from "../types/AssignmentData";

/**
 * Represents a controller for Assignment objects.
 * Is called by AssignmentRouter to access Assignment objects.
 * Calls AssignmentDAO to persist Assignment objects in the database.
 */
export interface IAssignmentManager {
    getAssignments() : Promise<IAssignment[]>;
    getAssignment(assignmentId : string) : Promise<IAssignment>;
    createAssignment(data : AssignmentData) : Promise<IAssignment>;
    updateAssignment(assignmentId : string, data : AssignmentData) : Promise<IAssignment>;
    deleteAssignment(assignmentId : string) : Promise<void>;
    warmCaches() : Promise<void>;
    invalidateCaches() : void;
}

export class AssignmentManager implements IAssignmentManager {

    private static instance : IAssignmentManager;
    private assignmentCache : Map<string,IAssignment>;
    private cacheCount : number

    private constructor() {
        this.assignmentCache = new Map<string,IAssignment>();
        this.cacheCount = 0;
    }   
    
    /**
     * Gets or creates singleton instance of AssignmentManager 
     */
    public static getInstance() : IAssignmentManager {
        if(!AssignmentManager.instance) {
            AssignmentManager.instance = new AssignmentManager();
        }

        return AssignmentManager.instance;
    }

    /**
     * Sets up caches for incoming requests
     */
    warmCaches = async(): Promise<void> => {

        return new Promise((resolve, reject) => {
        
                this.getAssignments().then((assignments) => {
                    this.cacheCount = assignments.length;
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            
        });
    }

    /**
     * Reset all caches (for testing)
     */
    invalidateCaches() : void {
        this.assignmentCache = new Map<string,IAssignment>();
        this.cacheCount = 0;
    }

    /**
     * Creates an Assignment with the given AssignmentData
     * @param data AssignmentData to use when creating an Assignment
     * @returns A Promise containing the created Assignment
     */
    createAssignment = async(data : AssignmentData): Promise<IAssignment> => {

        return new Promise((resolve, reject) => {
            let name = data.name;

            AssignmentDAO.createAssignment(name)
                .then((assignment) => {
                    this.assignmentCache.set(assignment.getId(), assignment);
                    this.cacheCount++;
                    resolve(assignment);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Gets a reference to an Assignment with the given id (if one exists)
     * @param assignmentId
     * @returns A Promise containing the requested Assignment
     */
    getAssignment = async(assignmentId : string) : Promise<IAssignment> => {
        return new Promise((resolve,reject) => {
            
            //Read from cache if entry exists
            if(this.assignmentCache.get(assignmentId) != undefined) {
                resolve(this.assignmentCache.get(assignmentId));
            } else {
                //Read from database if cache entry does not exist
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

    /**
     * Gets all Assignments in the system.
     * @returns A Promise containing all Assignments in the cache and/or database
     */
    getAssignments = async(): Promise<IAssignment[]> => {

        return new Promise((resolve, reject) => {

            //Read from database if cache is empty
            if(this.cacheCount <= 0) {
                AssignmentDAO.readAssignments().then((assignments) => {

                    for(let assignment of assignments) {
                        this.assignmentCache.set(assignment.getId(),assignment);
                        this.cacheCount++;
                    }

                    resolve(assignments);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                //Read from cache if entries exist
                let rtnAssignments : IAssignment[] = [];
                for (var assignment of this.assignmentCache.values()) {
                    rtnAssignments.push(assignment);
                }
                resolve(rtnAssignments);
            }
        });
    }

    /**
     * Update the assignment with the given assignmentId with the provided assignmentData
     * @param assignmentId Assignment to to update
     * @param data Data to use when updating Assignment
     * @return a Promise containing the updated Assignment
     */
    updateAssignment = async(assignmentId : string, data : AssignmentData) : Promise<IAssignment> => {

        return new Promise((resolve,reject) => {
            
            this.getAssignment(assignmentId).then((assignment) => {

                assignment.setName(data.name);

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

    /**
     * Deletes the specified assignment from cache and database
     * @param assignmentId Assignment to delete
     * @returns A Promise (containing nothing)
     */
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