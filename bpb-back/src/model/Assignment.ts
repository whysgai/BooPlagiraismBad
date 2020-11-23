import mongoose, { Document, Schema } from "mongoose";
import { Submission } from "./Submission";

/**
 * Represents an Assignment database model object
 */
export interface IAssignmentModel extends Document {
    _id : string
    name : string
    submissionIds : string[]
}

/**
 * Represents an Assignment to which Submissions may be made.
 */
export interface IAssignment {
    getID() : string
    getName() : string
    getSubmissionIDs() : string[]
    addSubmission(submissionID : string) : void
    removeSubmission(submissionID : string) : void
    getModelInstance() : Document;
    asJSON() : Object;
}
    
export class Assignment implements IAssignment {

    /**
     * Builder for Assignments
     */
    static builder = class AssignmentBuilder {

        private name : string;
        private submissionIds: string[];

        constructor() {
            this.name = "Name Not Defined";
            this.submissionIds = [];
        }

        setName(name : string) : void {
            this.name = name;
        }

        setSubmissionIds(submissionIds : string[]) : void {
            this.submissionIds = submissionIds;
        }

        build() : IAssignment {
            var assignment = new Assignment();

            var assignmentModel = Assignment.getStaticModel();
            var modelInstance = new assignmentModel({"name" : this.name, "submissionIds" : this.setSubmissionIds});

            assignment.setId(modelInstance.id);
            assignment.setName(modelInstance.name);
            assignment.setModelInstance(modelInstance);
            assignment.setSubmissionIds(modelInstance.submissionIds);

            return assignment;
        }

        //NOTE: Using buildFromExisting overrides all other builder methods
        buildFromExisting(model : IAssignmentModel) : IAssignment {
            var assignment = new Assignment();

            if (!model._id || !model.name || !model.submissionIds) {
                throw new Error("At least one required assignment model property is not present on the provided model");
            }

            assignment.setId(model._id);
            assignment.setModelInstance(model);
            assignment.setName(model.name);
            assignment.setSubmissionIds(model.submissionIds);

            return assignment;
        }
    }


    
    private static assignmentSchema = new Schema({
        _id:  String,
        name: String,
        submissionIds: [String]
      });

    private static assignmentModel = mongoose.model<IAssignmentModel>('Assignment',Assignment.assignmentSchema);
    
    private submissionIds : string[];
    private modelInstance : IAssignmentModel;
    private id : string;
    private name : string;
    
    protected constructor() {
    }

    static getStaticModel() : mongoose.Model<IAssignmentModel> {
        return this.assignmentModel;
    }
    protected setId(id : string): void {
        this.id = id;
    }
    protected setModelInstance(modelInstance : IAssignmentModel) : void {
        this.modelInstance = modelInstance;
    }
    protected setName(name : string) : void {
        this.name = name;
    }
    protected setSubmissionIds(submissionIds : string[]) {
        this.submissionIds = submissionIds;
    }
    getID(): string {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getSubmissionIDs(): string[] {
        return this.submissionIds;
    }
    addSubmission(submissionId: string): void {
        if(!this.submissionIds.find( it => it == submissionId)) {
            this.submissionIds.push(submissionId);
        }
    }
    removeSubmission(submissionId: string): void {
        var foundValueIndex = this.submissionIds.findIndex( it => it == submissionId);
        if(foundValueIndex != -1) {
            this.submissionIds.splice(foundValueIndex,1);
        }
    }
    getModelInstance() : Document {
        return new Assignment.assignmentModel({"_id":this.id,"name":this.name,"submissionIds":this.submissionIds});
    }
    asJSON() : Object {
        return {_id:this.id, name:this.name, submissionIds:this.submissionIds};
    }

}