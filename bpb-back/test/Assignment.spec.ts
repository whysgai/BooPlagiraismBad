import { expect } from "chai";
import {Assignment,IAssignment} from "../src/model/Assignment"
import {IAssignmentFactory,AssignmentFactory} from "../src/model/AssignmentFactory"

describe.skip("Assignment.ts",() => {

    var assignment : IAssignment;
    var assignmentName : String;
    var assignmentId : String;

    before(() => {
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
            expect(assignment.getSubmissionIDs).to.be.empty;
        });
        
        it("Should return the assignment’s submission’s {id}s if there are some",() => {
            assignment.addSubmission("some_submission_id");
            expect(assignment.getSubmissionIDs).to.contain("some_submission_id");
        });
    });

    describe("addSubmission()",() => {
        it("Should add a submission to the assignment",() => {
            expect(assignment.getSubmissionIDs).to.be.empty;
            assignment.addSubmission("some_submission_id");
            expect(assignment.getSubmissionIDs).to.contain("some_submission_id");
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
});