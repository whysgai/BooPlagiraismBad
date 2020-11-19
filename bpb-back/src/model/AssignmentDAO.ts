import {IAssignment, Assignment} from './Assignment'
import { AssignmentFactory } from './AssignmentFactory';
//import AssignmentModel from './AssignmentModel';

export interface IAssignmentDAO {
    createAssignment(assignment : IAssignment) : Promise<void>; 
    readAssignments(assignmentIds : string[]) : Promise<IAssignment[]>;
    readAssignment(assignmentId : string) : Promise<IAssignment>;
    updateAssignment(assignment : IAssignment) : Promise<void>;
    deleteAssignment(assignment : IAssignment) : Promise<void>;
}
/**
 * Singleton Data Access Object for manipulating Assignment database objects.
 */
export class AssignmentDAO implements IAssignmentDAO {
    
    constructor(){
        //TODO: Singletonness
    }
    
    async createAssignment(Assignment : IAssignment): Promise<void> {
        //Create the Assignment in DB
        //var assignment = AssignmentFactory.buildAssignment("test","test");
        //return assignment.getNewModelInstance().save().then((res) => {return;})
        return undefined;
    }
    
    async readAssignments(): Promise<IAssignment[]> {
        //Return the specified Assignments from db
        //This probably needs some kind of filter
        //TODO: Add parameter to use as filter
        return undefined;
    }

    async readAssignment(AssignmentID: string): Promise<IAssignment> {
        return undefined;
    }

    async updateAssignment(Assignment: IAssignment) : Promise<void> {
        return undefined;
    }
    async deleteAssignment(Assignment: IAssignment): Promise<void> {
        //Delete the specified Assignment from the db
        return undefined;
    }
}