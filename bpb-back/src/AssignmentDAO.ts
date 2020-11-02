import { IAssignment } from "./Assignment";

export interface IAssignmentDAO {
    createAssignment() : IAssignment
    readAssignment(assignmentID : String) : IAssignment
    updateAssignment(assignmentID : String, assignment : IAssignment) : IAssignment
    deleteAssignment(assignmentID : String) : IAssignment
}

export class AssignmentDAO implements IAssignmentDAO {

    createAssignment(): IAssignment {
        throw new Error("Method not implemented.");
    }
    readAssignment(assignmentID: String): IAssignment {
        throw new Error("Method not implemented.");
    }
    updateAssignment(assignmentID: String, assignment: IAssignment): IAssignment {
        throw new Error("Method not implemented.");
    }
    deleteAssignment(assignmentID: String): IAssignment {
        throw new Error("Method not implemented.");
    }

}

