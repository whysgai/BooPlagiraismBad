import { IAssignment } from "./Assignment";
import { IAssignmentDAO } from "./AssignmentDAO";

/**
 * Represents a controller for Assignment objects.
 */
export interface IAssignmentManager {
    getAssignments() : Promise<IAssignment[]>;
    createAssignment(data : JSON) : Promise<IAssignment>;
    updateAssignment(assignment : IAssignment, data : JSON) : Promise<void>;
    deleteAssignment(assignment : IAssignment) : Promise<void>;
}

export class AssignmentManager implements IAssignmentManager {
    
    private assignmentDAO : IAssignmentDAO;

    constructor(assignmentDAO: IAssignmentDAO) {
        this.assignmentDAO = assignmentDAO;
    }    
    
    async getAssignments(): Promise<IAssignment[]> {
        throw new Error("Method not implemented.");
    }
    async createAssignment(data : JSON): Promise<IAssignment> {
        throw new Error("Method not implemented.");
    }
    async updateAssignment(assignment: IAssignment, data : JSON) : Promise<void> {
        throw new Error("Method not implemented.");
    }
    async deleteAssignment(assignment : IAssignment) : Promise<void> {
        throw new Error("Method not implemented.");
    }
}