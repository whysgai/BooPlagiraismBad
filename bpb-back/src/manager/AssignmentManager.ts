import { IAssignment } from "../model/Assignment";
import { IAssignmentDAO } from "../model/AssignmentDAO";

/**
 * Represents a controller for Assignment objects.
 */
export interface IAssignmentManager {
    getAssignments() : Promise<IAssignment[]>;
    getAssignment(assignmentId : String) : Promise<IAssignment>;
    createAssignment(data : Object) : Promise<IAssignment>;
    updateAssignment(assignmentId : String, data : Object) : Promise<IAssignment>;
    deleteAssignment(assignmentId : String) : Promise<void>;
}

export class AssignmentManager implements IAssignmentManager {

    private assignmentDAO : IAssignmentDAO;

    constructor(assignmentDAO: IAssignmentDAO) {
        this.assignmentDAO = assignmentDAO;
    }   
    
    async getAssignments(): Promise<IAssignment[]> {
        throw new Error("Method not implemented")
    }

    async getAssignment(assignmentId: String): Promise<IAssignment> {
        throw new Error("Method not implemented.");
        //should reject promise with "The requested assignment does not exist" if assignment doesn't exist with the given id
    }

    async createAssignment(data : Object): Promise<IAssignment> {
        throw new Error("Method not implemented.");
    }
    async updateAssignment(assignmentId : String, data : Object) : Promise<IAssignment> {
        throw new Error("Method not implemented.");
    }
    async deleteAssignment(assignment : String) : Promise<void> {
        throw new Error("Method not implemented.");
    }
}