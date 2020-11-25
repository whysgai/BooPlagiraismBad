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

    constructor() {
        this.assignmentCache = new Map<string,IAssignment>();
    }   
    
    createAssignment = async(data : AssignmentData): Promise<IAssignment> => {

        return new Promise((resolve, reject) => {
            var name = data.name;
            var submissionIds = data.submissionIds;

            AssignmentDAO.createAssignment(name, submissionIds)
                .then((assignment) => {
                    this.assignmentCache.set(assignment.getId(), assignment);
                    resolve(assignment);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    async getAssignment(assignmentId : string) : Promise<IAssignment> {
        return new Promise((resolve,reject) => {
            resolve(new Assignment.builder().build()); //TODO: Remove fake assignment! Required for SubmissionRouter.
        });
    }

    async getAssignments(): Promise<IAssignment[]> {
        // if chache is empty, load from db
        // else check cache
        throw new Error("Method not implemented")
    }

    async updateAssignment(assignmentId : string, data : AssignmentData) : Promise<IAssignment> {
        throw new Error("Method not implemented.");
    }

    async deleteAssignment(assignmentId : string) : Promise<void> {
        throw new Error("Method not implemented.");
    }
}