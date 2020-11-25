import { Assignment, IAssignment } from "../model/Assignment";
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
                    console.log(assignment);
                    this.assignmentCache.set(assignmentId, assignment);
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
        // remember to update cacheCount if cache miss occurs
        throw new Error("Method not implemented.");
    }

    deleteAssignment = async(assignmentId : string) : Promise<void> => {
        // remember to decrease cacheCount
        throw new Error("Method not implemented.");
    }
}