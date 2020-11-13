import {IAssignment, Assignment} from './Assignment'
//import AssignmentModel from './AssignmentModel';

export interface IAssignmentDAO {
    createAssignment(assignment : IAssignment) : Promise<void>; 
    readAssignments(assignmentIds : String[]) : Promise<IAssignment[]>;
    readAssignment(assignmentId : String) : Promise<IAssignment>;
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
        //var sub = new AssignmentModel({_id : Assignment.getId()});
        //return sub.save().then((res) => { return; });
        return undefined;
    }
    
    async readAssignments(): Promise<IAssignment[]> {
        //Return the specified Assignments from db
        //This probably needs some kind of filter
        //TODO: Add parameter to use as filter
        return undefined;
    }

    async readAssignment(AssignmentID: String): Promise<IAssignment> {
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