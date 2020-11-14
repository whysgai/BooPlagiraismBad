import { Assignment, IAssignment } from "./Assignment";
import { AssignmentDAO } from "./AssignmentDAO";
import { AssignmentManager, IAssignmentManager } from "./AssignmentManager";

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

    // TODO REMOVE THIS
    static async buildAssignmentManager() : Promise<IAssignmentManager> {
        return Promise.resolve(new AssignmentManager(new AssignmentDAO()));
    }
}