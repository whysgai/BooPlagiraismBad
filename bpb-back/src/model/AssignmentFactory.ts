import { Assignment, IAssignment } from "./Assignment";

export interface IAssignmentFactory {
    //buildAssignment(id : String, name: String) : IAssignment
}
/**
 * Builds Assignment objects
 */
export class AssignmentFactory implements IAssignmentFactory {
     static buildAssignment(id : String, name: String): IAssignment {
         return new Assignment(id,name);
    }
}