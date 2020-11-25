import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import chaiAsPromised = require("chai-as-promised");
import {AssignmentDAO} from "../src/model/AssignmentDAO";
import { AssignmentManager, IAssignmentManager } from "../src/manager/AssignmentManager";
import { IAssignment, Assignment } from "../src/model/Assignment";
import { ExpressionContext } from "java-ast";

describe("AssignmentManager.ts",() => {

    var testAssignmentManager : IAssignmentManager;
    var testAssignment : IAssignment;

    before(() => {
        chai.use(chaiSpies);
        chai.use(chaiAsPromised);
    });

    beforeEach(() => {
        chai.spy.restore(AssignmentDAO,'createAssignment');
        chai.spy.restore(AssignmentDAO,'readAssignment');
        chai.spy.restore(AssignmentDAO,'readAssignments');
        chai.spy.restore(AssignmentDAO,'updateAssignment');
        chai.spy.restore(AssignmentDAO,'deleteAssignment');

        testAssignmentManager = new AssignmentManager();
        testAssignment = new Assignment.builder().build();
    });

    describe("createAssignment()",()  => {
        it("Should create an assignment if inputs are valid",() => {

            var mockCreateAssignment = chai.spy.on(AssignmentDAO,'createAssignment',() => { return Promise.resolve(testAssignment) });

            var createData = {"name":testAssignment.getName(),"submissionIds":testAssignment.getSubmissionIds()};

            return testAssignmentManager.createAssignment(createData).then((assignment) => {
                expect(assignment.getName()).to.equal(testAssignment.getName());
                expect(assignment.getSubmissionIds()).to.equal(testAssignment.getSubmissionIds());
            });
        });
    });

    describe("getAssignment()",() => {
        it("Should return the specified assignment if one exists with the given id");
        it("Should throw an appropriate error if the specified assignment does not exist");
    })
    describe("getAssignments()",() => {
        it("Should return assignments if assignments exist");
        it("Should return no assignments if none exist");
    });

    describe("updateAssignment()",()=> {
        it("Should correctly manipulate AssignmentDAO to update an assignment if {id} is valid");
        it("Should throw an appropriate error when trying to update an assignment if {id} is invalid");
    });

    describe("deleteAssignment()",() => {
        it("Should correctly manipulate AssignmentDAO to delete an assignment if {id} is valid");
        it("Should throw an appropriate error when trying to delete an assignment if {id} is invalid");
    });
});