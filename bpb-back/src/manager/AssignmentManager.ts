import { Assignment, IAssignment } from "../model/Assignment";
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

    constructor() {}   
    
    async getAssignments(): Promise<IAssignment[]> {
        throw new Error("Method not implemented")
    }
    async getAssignment(assignmentId : string) : Promise<IAssignment> {
        return new Promise((resolve,reject) => {
            resolve(new Assignment.builder().build()); //TODO: Remove fake assignment! Required for SubmissionRouter.
        });
    }
    async createAssignment(data : AssignmentData): Promise<IAssignment> {
        throw new Error("Method not implemented.");
    }
    async updateAssignment(assignmentId : string, data : AssignmentData) : Promise<IAssignment> {
        throw new Error("Method not implemented.");
    }
    async deleteAssignment(assignmentId : string) : Promise<void> {
        throw new Error("Method not implemented.");
    }
}