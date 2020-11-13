import { IAssignment } from "./Assignment";


export interface IAssignmentFactory {
    buildAssignment(id : String, name: String) : IAssignment
}

export class AssignmentFactory implements IAssignmentFactory {
     buildAssignment(id : String, name: String): IAssignment {
        throw new Error("Method not implemented.");
    }
}