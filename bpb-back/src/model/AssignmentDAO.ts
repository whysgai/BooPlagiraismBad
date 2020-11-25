import {IAssignment, Assignment} from './Assignment'

export interface IAssignmentDAO {
    createAssignment(name : string, submissionIds : string[]) : Promise<IAssignment>; 
    readAssignments() : Promise<IAssignment[]>;
    readAssignment(assignmentId : string) : Promise<IAssignment>;
    updateAssignment(assignment : IAssignment) : Promise<IAssignment>;
    deleteAssignment(assignmentId : string) : Promise<void>;
}
/**
 * Singleton Data Access Object for manipulating Assignment database objects.
 */
export const AssignmentDAO : IAssignmentDAO = class {
    
    
    static async createAssignment(name : string, submissionIds : string[]): Promise<IAssignment> {
        //Create the Assignment in DB
        //var assignment = AssignmentFactory.buildAssignment("test","test");
        //return assignment.getNewModelInstance().save().then((res) => {return;})
        return undefined;
    }
    
    static async readAssignments(): Promise<IAssignment[]> {
        //Return the specified Assignments from db
        //This probably needs some kind of filter
        //TODO: Add parameter to use as filter
        return undefined;
    }

    static async readAssignment(AssignmentID: string): Promise<IAssignment> {
        return undefined;
    }

    static async updateAssignment(assignment : IAssignment) : Promise<IAssignment> {
        return undefined;
    }
    static async deleteAssignment(assignmentId : string): Promise<void> {
        //Delete the specified Assignment from the db
        return undefined;
    }
}