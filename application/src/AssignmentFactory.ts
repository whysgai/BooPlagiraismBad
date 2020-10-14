import { IAssignment } from "./Assignment";

export interface IAssignmentFactory {
    buildAssignment() : IAssignment
}

export class AssignmentFactory implements IAssignmentFactory {
    buildAssignment(): IAssignment {
        throw new Error("Method not implemented.");
    }
}