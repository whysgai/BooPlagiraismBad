import { expect } from "chai";
import {Assignment,IAssignment} from "../src/model/Assignment"

describe("Assignment.ts",() => {

    var assignment : IAssignment;
    var assignmentName : string;
    var subIds : string[];

    beforeEach(() => {
        assignmentName = "Dr Hugo Z. Hackenbush"        
        const assignmentBuilder = new Assignment.builder();
        assignmentBuilder.setName(assignmentName);        
        assignment = assignmentBuilder.build();
    });

    describe('AssignmentBuilder', () => {
        it("should correctly build an assignment if no builder methods are called", () => {
            assignment = new Assignment.builder().build();
            expect(assignment.getId()).to.not.be.undefined;
            expect(assignment.getName()).to.not.be.undefined;
            expect(assignment.getSubmissionIds()).to.not.be.undefined;
            expect(assignment.getModelInstance()).to.not.be.undefined;
            
        });
        it("should correctly build an assignment if builder methods are called", () => {
            const testName = "Xavier Chambers: Master of Microservices";
            const testSubIds = [
                "Dr. Jones and the Technicolor Code Coverage Report", 
                "Felicia's Static Code Analysis Mission #3"
            ]
            const testAssignmentBuilder = new Assignment.builder();
            testAssignmentBuilder.setName(testName);
            testAssignmentBuilder.setSubmissionIds(testSubIds)
            assignment = testAssignmentBuilder.build();

            expect(assignment.getId()).to.equal(assignment.getModelInstance().id);
            expect(assignment.getName()).to.equal(testName);
            expect(assignment.getSubmissionIds()).to.equal(testSubIds);
        });

        it("should correctly build an assignment from exisiting database model", () => {
            const existingName = "Otis B Driftwood";
            const existingSubIds = [
                "Tomasso", 
                "Fiorello",
                "Mrs. Claypool"
            ]

            let exisitingAssignmentBuilder = new Assignment.builder();
            exisitingAssignmentBuilder.setName(existingName);
            exisitingAssignmentBuilder.setSubmissionIds(existingSubIds);
            assignment = exisitingAssignmentBuilder.build();
            let exisitingModel = assignment.getModelInstance();

            let testExistingAssigmentBuilder = new Assignment.builder();
            let existingAssignment = testExistingAssigmentBuilder.buildFromExisting(exisitingModel);

            expect(existingAssignment.getId()).to.deep.equal(assignment.getId());
            expect(existingAssignment.getName()).to.deep.equal(assignment.getName());
            expect(existingAssignment.getSubmissionIds()).to.deep.equal(assignment.getSubmissionIds());
        });
        
        it("Should throw an appropriate error message if the provided model is missing one or more properties",() => {
            // Compiler error when giving it empty object, unsure how to test
            let testAssignmentBuilder : any;
            testAssignmentBuilder = new Assignment.builder();
            expect(() => { testAssignmentBuilder.buildFromExisting({}); }).to.throw("At least one required assignment model property is not present on the provided model");
        });
    });

    describe('getId()',() => {
        it("Should return the assignment’s {id}",() =>{
            expect(assignment.getId()).to.equal(assignment.getId());
        });
    });

    describe("getName()",() => {
        it("Should return the assignment’s name",() => {
            expect(assignment.getName()).to.equal(assignmentName);
        });
    });

    describe("getSubmissionIds()",() => {
        it("Should return an empty collection if assignment has no submissions ",() => {
            expect(assignment.getSubmissionIds()).to.be.empty;
        });
        
        it("Should return the assignment’s submission’s {id}s if there are some",() => {
            assignment.addSubmission("some_submission_id");
            expect(assignment.getSubmissionIds()).to.contain("some_submission_id");
        });
    });

    describe("addSubmission()",() => {
        it("Should add a submission to the assignment",() => {
            expect(assignment.getSubmissionIds()).to.be.empty;
            assignment.addSubmission("some_submission_id");
            expect(assignment.getSubmissionIds()).to.contain("some_submission_id");
        });
    });

    describe("removeSubmission()",() => {
        it("Should not remove a submission from the assignment if the specified submission does not exist",() => {
            assignment.addSubmission("a");
            assignment.addSubmission("c");
            assignment.removeSubmission("b");
            expect(assignment.getSubmissionIds()).to.contain("a");
            expect(assignment.getSubmissionIds()).to.contain("c");
            expect(assignment.getSubmissionIds().length).to.equal(2);
 
        });
        
        it("Should remove a submission from the assignment if it exists",() => {
            assignment.addSubmission("a");
            assignment.addSubmission("b");
            assignment.addSubmission("c");
            assignment.removeSubmission("b");
            expect(assignment.getSubmissionIds()).to.not.contain("b");
            expect(assignment.getSubmissionIds().length).to.equal(2);
        });
    });

    describe("getModelInstance()",() => {
        it("should return a new model instance that matches the Assignment object if there are no submissions",() => {
            var modelInstance = assignment.getModelInstance();
            var expected  = '{\n  submissionIds: [],\n  _id: ' + assignment.getId() + ',\n  name: \'' + assignmentName + '\'\n}';
            expect(modelInstance.toString()).to.equal(expected);
        });
        
        it("should return a new model instance that matches the Assignment object if there are submissions added",() => {
            assignment.addSubmission("testy");
            assignment.addSubmission("testy2");
            var modelInstance = assignment.getModelInstance();
            var expected  = '{\n  submissionIds: [ \'testy\', \'testy2\' ],\n  _id: ' + assignment.getId() + ',\n  name: \'' + assignmentName + '\'\n}';
            expect(modelInstance.toString()).to.equal(expected);
        });

    });

    describe("getStaticModel()",() => {
        it("should return a valid Assignment model",() => {
            var staticModel = Assignment.getStaticModel();
            expect(staticModel.schema).to.not.be.undefined;
        });
    });

    describe("asJSON()", () => {
        it("should return a properly formatted JSON", () => {
            subIds = ["Tony","Stuffy","Emily Upjohn"];
            const assignmentBuilder = new Assignment.builder();
            assignmentBuilder.setName(assignmentName);
            assignmentBuilder.setSubmissionIds(subIds);
            assignment = assignmentBuilder.build();

            var expectedJSON = {
                "_id": assignment.getId(),
                "name": assignment.getName(),
                "submissionIds": assignment.getSubmissionIds()
            };

            expect(assignment.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});