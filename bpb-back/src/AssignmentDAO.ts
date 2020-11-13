import { Connection } from "mongoose";
import { IAssignment } from "./Assignment";

/**
 * Represents a Data Access Object for manipulating Assignment database objects.
 */
export interface IAssignmentDAO {
    createAssignment() : IAssignment
    readAssignment(assignmentID : String) : IAssignment
    updateAssignment(assignmentID : String, assignment : IAssignment) : IAssignment
    deleteAssignment(assignmentID : String) : IAssignment
}

export class AssignmentDAO implements IAssignmentDAO {

    private dbConnection : Connection;

    constructor(dbConnection : Connection){
        this.dbConnection = dbConnection;
    }

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

