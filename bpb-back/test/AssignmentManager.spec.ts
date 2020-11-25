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

            chai.spy.on(AssignmentDAO,'createAssignment',() => { return Promise.resolve(testAssignment) });

            var createData = {"name":testAssignment.getName(),"submissionIds":testAssignment.getSubmissionIds()};

            return testAssignmentManager.createAssignment(createData).then((assignment) => {
                expect(assignment.getName()).to.equal(testAssignment.getName());
                expect(assignment.getSubmissionIds()).to.equal(testAssignment.getSubmissionIds());
            });
        });

        it("Should throw an appropriate error if input data is not valid",() => {
            var createData = {"name":undefined as string,"submissionIds":undefined as string[]};

            return expect(testAssignmentManager.createAssignment(createData)).to.be.rejectedWith("Input data is not valid");        
        });

        it("Should throw an appropriate error if DAO createAssignment fails",() => {
   
            chai.spy.on(AssignmentDAO,'createAssignment',() => { return Promise.reject(new Error("Create failed")) });

            var createData = {"name":testAssignment.getName(),"submissionIds":testAssignment.getSubmissionIds()};

            return expect(testAssignmentManager.createAssignment(createData)).to.be.rejectedWith("Create failed");        
        });
    });

    describe("getAssignment()",() => {
        it("Should return the specified assignment if one exists with the given id",() => {

            var mockReadAssignment = chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.resolve(testAssignment)});

            return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignment) => {
                expect(mockReadAssignment).to.have.been.called.with(testAssignment.getId());
                expect(assignment).to.deep.equal(testAssignment);
            });
        });

        it("Should throw an appropriate error if the specified assignment does not exist",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.reject(new Error("An assignment does not exist with the given id"))});
            
            return expect(testAssignmentManager.getAssignment(testAssignment.getId())).to.eventually.be.rejected.with("An assignment does not exist with the given id");
        });
    })
    describe("getAssignments()",() => {
        it("Should return assignments if assignments exist",() => {
            var mockAssignment = new Assignment.builder().build();
            var expectedAssignments = [testAssignment,mockAssignment];
            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

            return testAssignmentManager.getAssignments().then((assignments) => {
                expect(mockReadAssignments).to.have.been.called.once;
                expect(assignments).to.deep.equal(expectedAssignments);
            });
        });

        it("Should return no assignments if none exist",() => {
            var expectedAssignments = [] as IAssignment[];
            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

            return testAssignmentManager.getAssignments().then((assignments) => {
                expect(mockReadAssignments).to.have.been.called.once;
                expect(assignments).to.deep.equal(expectedAssignments);
            });
        });

        it("Should throw an appropriate error if DAO fails to read assignments",() => {
            chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.reject(new Error("Failed to read assignments"))});
            return expect(testAssignmentManager.getAssignments()).to.eventually.be.rejectedWith("Failed to read assignments");
        })
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