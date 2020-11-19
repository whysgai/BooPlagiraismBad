import mongoose, { Document, Schema } from "mongoose";

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
    
    private static assignmentSchema = new Schema({
        _id:  String,
        name: String,
        submissionIds: [String]
      });

    private static assignmentModel = mongoose.model<IAssignmentModel>('Assignment',Assignment.assignmentSchema);
    
    private submissionIds : string[];
    
    constructor(private id : string, private name :string) {
        this.id = id;
        this.name = name
        this.submissionIds = [];
    }
    static getStaticModel() : mongoose.Model<IAssignmentModel> {
        return this.assignmentModel;
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