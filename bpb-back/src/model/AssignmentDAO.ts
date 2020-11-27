import {IAssignment} from './Assignment'

export interface IAssignmentDAO {
    createAssignment(name : string, submissionIds : string[]) : Promise<IAssignment>; 
    readAssignments() : Promise<IAssignment[]>;
    readAssignment(assignmentId : string) : Promise<IAssignment>;
    updateAssignment(assignment : IAssignment) : Promise<IAssignment>;
    deleteAssignment(assignmentId : string) : Promise<void>;
}
/**
 * Data Access Object for manipulating Assignment database objects.
 */
export const AssignmentDAO : IAssignmentDAO = class {
    
    /**
     * Creates an assignment with the given name and submissionIds
     * @param name 
     * @param submissionIds 
     * @returns A Promise containing the created Assignment
     */
    static async createAssignment(name : string, submissionIds : string[]): Promise<IAssignment> {
        return new Promise((resolve, reject) => {resolve(undefined)} );
    }
    
    /**
     * Obtains all Assignments from the database
     * @returns A Promise containing all Assignments in the databse
     */
    static async readAssignments(): Promise<IAssignment[]> {
        return new Promise((resolve, reject) => {resolve(undefined)} );
    }

    /**
     * Obtains the specified assignment from the database
     * @param AssignmentId Id of the assignment to obtain
     * @returns A Promise containing the requested assignment, if it exists
     */
    static async readAssignment(AssignmentID: string): Promise<IAssignment> {
        return new Promise((resolve, reject) => {resolve(undefined)} );
    }

    /**
     * Updates the database records which match the specified assignment to match the specified assignment's data
     * @param assignment Assignment to update
     * @returns A Promise containing the updated Assignment
     */
    static async updateAssignment(assignment : IAssignment) : Promise<IAssignment> {
        return new Promise((resolve, reject) => {resolve(undefined)} );
    }

    /**
     * Deletes the specified assignment from the database
     * @param assignmentId Assignment to delete
     * @returns A Promise containing nothing
     */
    static async deleteAssignment(assignmentId : string): Promise<void> {
        return new Promise((resolve, reject) => {resolve(undefined)} );
    }
}