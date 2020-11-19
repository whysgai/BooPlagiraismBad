import { Assignment, IAssignment } from "./Assignment";

export interface IAssignmentFactory {}
/**
 * Builds Assignment objects
 */
export class AssignmentFactory implements IAssignmentFactory {
     static buildAssignment(id : string, name: string): IAssignment {
         return new Assignment(id,name);
    }
}