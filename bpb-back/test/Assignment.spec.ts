import { expect } from "chai";
import {Assignment,IAssignment} from "../src/model/Assignment"

describe("Assignment.ts",() => {

    let assignment : IAssignment;
    let assignmentName : string;
    let subIds : string[];

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
            assignment = testAssignmentBuilder.build();

            expect(assignment.getId()).to.equal(assignment.getModelInstance().id);
            expect(assignment.getName()).to.equal(testName);
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
            assignment = exisitingAssignmentBuilder.build();
            let exisitingModel = assignment.getModelInstance();

            let testExistingAssigmentBuilder = new Assignment.builder();
            let existingAssignment = testExistingAssigmentBuilder.buildFromExisting(exisitingModel);

            expect(existingAssignment.getId()).to.deep.equal(assignment.getId());
            expect(existingAssignment.getName()).to.deep.equal(assignment.getName());
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

    describe("getModelInstance()",() => {
        it("should return a new model instance that matches the Assignment object if there are no submissions",() => {
            let modelInstance = assignment.getModelInstance();
            let expected  = '{ _id: ' + assignment.getId() + ', name: \'' + assignmentName + '\' }';
            expect(modelInstance.toString()).to.equal(expected);
        });
        

    });

    describe("getStaticModel()",() => {
        it("should return a valid Assignment model",() => {
            let staticModel = Assignment.getStaticModel();
            expect(staticModel.schema).to.not.be.undefined;
        });
    });

    describe("asJSON()", () => {
        it("should return a properly formatted JSON", () => {
            subIds = ["Tony","Stuffy","Emily Upjohn"];
            const assignmentBuilder = new Assignment.builder();
            assignmentBuilder.setName(assignmentName);
            assignment = assignmentBuilder.build();

            let expectedJSON = {
                "_id": assignment.getId(),
                "name": assignment.getName()
            };

            expect(assignment.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});