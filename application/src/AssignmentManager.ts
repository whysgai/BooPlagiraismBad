import { IAssignment } from "./Assignment";

export interface IAssignmentManager {
    getAssignments() : IAssignment[]
    createAssignment() : IAssignment
    updateAssignment(assignment : IAssignment) : IAssignment
    deleteAssignment() : IAssignment
}

export class AssignmentManager implements IAssignmentManager {
    getAssignments(): IAssignment[] {
        throw new Error("Method not implemented.");
    }
    createAssignment(): IAssignment {
        throw new Error("Method not implemented.");
    }
    updateAssignment(assignment: IAssignment) :IAssignment {
        throw new Error("Method not implemented.");
    }
    deleteAssignment() : IAssignment {
        throw new Error("Method not implemented.");
    }
}