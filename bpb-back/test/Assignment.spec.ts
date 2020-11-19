import { expect } from "chai";
import { model } from "mongoose";
import {Assignment,IAssignment} from "../src/model/Assignment"
import {AssignmentFactory} from "../src/model/AssignmentFactory"

describe("Assignment.ts",() => {

    var assignment : IAssignment;
    var assignmentName : string;
    var assignmentId : string;

    beforeEach(() => {
        assignmentId = "test_id"
        assignmentName = "test_name"
        assignment = AssignmentFactory.buildAssignment(assignmentId,assignmentName);
    });

    describe('getId()',() => {
        it("Should return the assignment’s {id}",() =>{
            expect(assignment.getID()).to.equal(assignmentId);
        });
    });

    describe("getName()",() => {
        it("Should return the assignment’s name",() => {
            expect(assignment.getName()).to.equal(assignmentName);
        });
    });

    describe("getSubmissionIds()",() => {
        it("Should return an empty collection if assignment has no submissions ",() => {
            expect(assignment.getSubmissionIDs()).to.be.empty;
        });
        
        it("Should return the assignment’s submission’s {id}s if there are some",() => {
            assignment.addSubmission("some_submission_id");
            expect(assignment.getSubmissionIDs()).to.contain("some_submission_id");
        });
    });

    describe("addSubmission()",() => {
        it("Should add a submission to the assignment",() => {
            expect(assignment.getSubmissionIDs()).to.be.empty;
            assignment.addSubmission("some_submission_id");
            expect(assignment.getSubmissionIDs()).to.contain("some_submission_id");
        });
    });

    describe("removeSubmission()",() => {
        it("Should not remove a submission from the assignment if the specified submission does not exist",() => {
            assignment.addSubmission("a");
            assignment.addSubmission("c");
            assignment.removeSubmission("b");
            expect(assignment.getSubmissionIDs()).to.contain("a");
            expect(assignment.getSubmissionIDs()).to.contain("c");
            expect(assignment.getSubmissionIDs().length).to.equal(2);
 
        });
        
        it("Should remove a submission from the assignment if it exists",() => {
            assignment.addSubmission("a");
            assignment.addSubmission("b");
            assignment.addSubmission("c");
            assignment.removeSubmission("b");
            expect(assignment.getSubmissionIDs()).to.not.contain("b");
            expect(assignment.getSubmissionIDs().length).to.equal(2);
        });
    });

    describe("getModelInstance()",() => {
        it("should return a new model instance that matches the Assignment object if there are no submissions",() => {
            var modelInstance = assignment.getModelInstance();
            var expected  = '{ submissionIds: [], _id: \'test_id\', name: \'test_name\' }';
            expect(modelInstance.toString()).to.equal(expected);
        });
        
        it("should return a new model instance that matches the Assignment object if there are submissions added",() => {
            assignment.addSubmission("testy");
            assignment.addSubmission("testy2");
            var modelInstance = assignment.getModelInstance();
            var expected  = '{\n  submissionIds: [ \'testy\', \'testy2\' ],\n  _id: \'test_id\',\n  name: \'test_name\'\n}';
            expect(modelInstance.toString()).to.equal(expected);
        });

    });

    describe("getStaticModel()",() => {
        it("should return a valid Assignment model",() => {
            var staticModel = Assignment.getStaticModel();
            expect(staticModel.schema).to.not.be.undefined;
        });
    });
});