import mongoose, { Document, Schema } from "mongoose";

/**
 * Represents an Assignment database model object
 */
export interface IAssignmentModel extends Document {
    _id : string
    name : string
}

/**
 * Represents an Assignment to which Submissions may be made.
 */
export interface IAssignment {
    getId() : string
    getName() : string
    setName(name: string) : void
    getModelInstance() : IAssignmentModel;
    asJSON() : Object;
}
    
export class Assignment implements IAssignment {

    /**
     * Builder for Assignments
     */
    static builder = class AssignmentBuilder {

        private name : string;

        constructor() {
            this.name = "Name Not Defined";
        }
        
        /**
         * Sets the name of the Assignment to be created
         * @param name name of Assignment
         */
        setName(name : string) : void {
            this.name = name;
        }

        /**
         * Builds a new Assignment
         * @returns a new Assignment with the appropriate properties and a database model
         */
        build() : IAssignment {
            let assignment = new Assignment();

            let assignmentModel = Assignment.getStaticModel();
            let modelInstance = new assignmentModel({"name" : this.name});

            assignment.setId(modelInstance.id);
            assignment.setName(this.name);
            assignment.setModelInstance(modelInstance);
            
            return assignment;
        }

        /**
         * Builds an existing Assignment from the specified model
         * Overrides other builder properties which may already be set
         * @param model database model to build from
         * @returns an Assignment object which matches (and contains) the provided model
         */
        buildFromExisting(model : IAssignmentModel) : IAssignment {
            let assignment = new Assignment();

            if (!model.id || !model.name) {
                throw new Error("At least one required assignment model property is not present on the provided model");
            }

            assignment.setId(model.id);
            assignment.setModelInstance(model);
            assignment.setName(model.name);

            return assignment;
        }
    }

    /**
     * Mongoose Schema for Submissions
     */
    private static assignmentSchema = new Schema({
        name: String,
      });

    /**
    * Static Model for Submissions
    */
    private static assignmentModel = mongoose.model<IAssignmentModel>('Assignment',Assignment.assignmentSchema);
    
    private id : string;
    private name : string;
    private modelInstance : IAssignmentModel;    

    protected constructor() { }

    /**
     * Returns the static database model for Assignments
     * @returns Mongoose static database model for Assignments
     */
    static getStaticModel() : mongoose.Model<IAssignmentModel> {
        return this.assignmentModel;
    }

    /**
     * Returns the Id of the Assignment
     * @returns assignmentId
     */
    getId(): string {
        return this.id;
    }

    /**
     * Returns the name of the Assignment
     * @returns assignment name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Returns a new Mongoose document model instance for the current entry
     * @returns Mongoose document model instance
     */
    getModelInstance() : IAssignmentModel {
        return new Assignment.assignmentModel({"_id":this.id,"name":this.name});
    }

    /**
     * Returns the current object as as JSON object
     */
    asJSON() : Object {
        return {_id:this.id, name:this.name};
    }
    
    /**
     * Sets the id of the Assignment. Called by AssignmentBuilder.
     * @param id ID to set
     */
    protected setId(id : string): void {
        this.id = id;
    }

    /**
     * Sets the database model instance of the Assignment. Called by AssignmentBuilder.
     * @param modelInstance model instance to set
     */
    protected setModelInstance(modelInstance : IAssignmentModel) : void {
        this.modelInstance = modelInstance;
    }

    /**
     * Sets the name of the assignment
     * @param name name to set
     */
    setName(name : string) : void {
        this.name = name;
    }

}