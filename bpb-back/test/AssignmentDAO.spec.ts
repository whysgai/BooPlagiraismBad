import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import {IAssignment, Assignment} from '../src/model/Assignment'

describe("AssignmentDAO.ts",() => {

    var testAssignment : IAssignment;
    var testAssignmentName : string;
    var testAssignmentSubmissionIds : string[];

    before((done) => {
        chai.use(chaiAsPromised);
        testAssignmentName =  "Prof. Sophira's CS6666 Assignment of Pointless Extremity";
        testAssignmentSubmissionIds =  ["5fc2a8b18636ab0ada9a21bb","5fbd82f618333b41055c1dff"];

        //TODO: Replace this (and beforeEach) with database mock (or something more elegant)
        //This is really fragile!
        mongoose.connect("mongodb://127.0.0.1:27017/bpbtest", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
            done();
        });
    });

    beforeEach((done)=>{

        //Restore global prototype mocks
        chai.spy.restore(Assignment.getStaticModel());

        mongoose.connection.collections.submissions.drop(() => {
            var testAssignmentBuilder = new Assignment.builder();
            testAssignmentBuilder.setName(testAssignmentName);
            testAssignmentBuilder.setSubmissionIds(testAssignmentSubmissionIds);
            testAssignment = testAssignmentBuilder.build();
            done();
        });
    });

    after((done) => {
        mongoose.connection.close();
        done();
    });

    describe("createAssignment()",() => {
        it("Should create an assignment database object if inputs are valid");
        it("Should throw an appropriate error if inputs are invalid");
        it("Should throw an appropriate error if assignment can't be saved");
    });

    describe("readAssignment()",() => {
        it("Should read an assignment database object if {id} is valid");
        it("Should throw an appropriate error when trying to update a nonexistent database object");
        it("Should throw an appropriate error if assignment can't be found");
    });   
        
    describe("updateAssignment()",() => {
        it("Should update an assignment database object if {id} is valid");
        it("Should throw an appropriate error if no assignment exists with the specified {id}");
        it("Should throw an appropriate error if database findOne fails");
        it("Should throw an appropriate error if database findOneAndUpdate fails");
    });

    describe("deleteAssignment()",() => {
        it("Should be able to delete an assignment database object");
        it("Should throw an appropriate error if {id} is invalid");
        it("Should throw an appropriate error if database findOne fails");
        it("Should throw an appropriate error if database findOneAndDelete fails");
    });
});
