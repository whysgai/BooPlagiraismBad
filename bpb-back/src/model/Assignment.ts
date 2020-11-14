import mongoose, { Document, Schema } from "mongoose";

/**
 * Represents an Assignment database model object
 */
export interface IAssignmentModel extends Document {
    _id : String
    name : String
    submissionIds : String[]
}

/**
 * Represents an Assignment to which Submissions may be made.
 */
export interface IAssignment {
    getID() : String
    getName() : String
    getSubmissionIDs() : String[]
    addSubmission(submissionID : String) : void
    removeSubmission(submissionID : String) : void
    getModelInstance() : Document;
}
    
export class Assignment implements IAssignment {
    
    private static assignmentSchema = new Schema({
        _id:  String,
        name: String,
        submissionIds: [String]
      });

    private static assignmentModel = mongoose.model<IAssignmentModel>('Assignment',Assignment.assignmentSchema);
    
    private submissionIds : String[];
    
    constructor(private id : String, private name :String) {
        this.id = id;
        this.name = name
        this.submissionIds = [];
    }
    getID(): String {
        return this.id;
    }
    getName(): String {
        return this.name;
    }
    getSubmissionIDs(): String[] {
        return this.submissionIds;
    }
    addSubmission(submissionId: String): void {
        if(!this.submissionIds.find( it => it == submissionId)) {
            this.submissionIds.push(submissionId);
        }
    }
    removeSubmission(submissionId: String): void {
        var foundValueIndex = this.submissionIds.findIndex( it => it == submissionId);
        if(foundValueIndex) {
            this.submissionIds = this.submissionIds.splice(foundValueIndex,1);
        }
    }
    getModelInstance() : Document {
        return new Assignment.assignmentModel({"_id":this.id,"name":this.name,"submissionIds":this.submissionIds});
    }
    static getStaticModel() : mongoose.Model<IAssignmentModel> {
        return this.assignmentModel;
    }
}