import { IAssignment } from "./Assignment";

/**
 * Represents a controller for Assignment objects.
 */
export interface IAssignmentManager {
    getAssignments() : IAssignment[]
    createAssignment(data : JSON) : IAssignment
    updateAssignment(assignment : IAssignment, data : JSON) : void
    deleteAssignment(assignment : IAssignment) : void
}

export class AssignmentManager implements IAssignmentManager {
    getAssignments(): IAssignment[] {
        throw new Error("Method not implemented.");
    }
    createAssignment(data : JSON): IAssignment {
        throw new Error("Method not implemented.");
    }
    updateAssignment(assignment: IAssignment, data : JSON) : void {
        throw new Error("Method not implemented.");
    }
    deleteAssignment(assignment : IAssignment) : void {
        throw new Error("Method not implemented.");
    }
}