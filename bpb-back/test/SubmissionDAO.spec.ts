
import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import {ISubmission, Submission} from "../src/model/Submission";

var mongoose = require('mongoose');

import { ISubmissionDAO, SubmissionDAO } from "../src/model/SubmissionDAO";

describe("SubmissionDAO.ts",() => {

    var testSubmissionDAO : ISubmissionDAO;
    var testSubmission : ISubmission;

    before((done) => {
        chai.use(chaiAsPromised);

        //TODO: Replace this (and beforeEach) with database mock (or something more elegant)
        //This is really fragile!
        mongoose.connect("mongodb://127.0.0.1:27017/bpbtest", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            done();
        });
    });

    beforeEach((done)=>{
        mongoose.connection.collections.submissions.drop(() => {
            testSubmissionDAO = new SubmissionDAO();
            testSubmission = new Submission("test","test");

            done();
        });
    });

    describe("createSubmission()",() => {

        it("Should create an submission database object if inputs are valid",()=> {
           
            return expect(testSubmissionDAO.createSubmission(testSubmission.getName(),testSubmission.getAssignmentId())).to.eventually.be.fulfilled.with("Submission").then((res) => {
                Submission.getStaticModel().findOne({"name":"testname"}).then((res) => {
                    expect(res).to.be("Submission").with.property("name").which.equals(testSubmission.getName());
                });
            });
        });
    });

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid",() => {

            return testSubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((submission) => {
                expect(testSubmissionDAO.readSubmission(submission.getId())).to.eventually.be.fulfilled.then((res) => {
                    expect(res).to.be("Submission").with.property("name").which.equals(testSubmission.getName());
                });
            });
        });
    
        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {

            var nonPersistedSubmission = new Submission("test","test")
            return expect(testSubmissionDAO.readSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Error: Cannot find: A submission with the given ID does not exist in the database");
        });
    });

    describe("readSubmissions()",() => {

        it("should throw an appropriate error if the provided assignment id is invalid",() => {

            var submission = new Submission("id1","1");
            return testSubmissionDAO.createSubmission(submission.getName(), submission.getAssignmentId()).then((res) => {
                expect(testSubmissionDAO.readSubmissions("invalidId")).to.eventually.be.rejectedWith("Error: Cannot find: A submission with one of the given IDs does not exist in the database");
            });
        });

        it("should return all submissions that exist in the database", () => {
            var assignmentId = "2";
            var submission = new Submission("id1",assignmentId);
            var submission2 = new Submission("id2",assignmentId);
            return testSubmissionDAO.createSubmission(submission.getName(), submission.getAssignmentId()).then((res) => {
                return testSubmissionDAO.createSubmission(submission2.getName(), submission2.getAssignmentId()).then((res2) => {

                    expect(testSubmissionDAO.readSubmissions(assignmentId)).to.eventually.be.fulfilled.then((res) => {
                        expect(res).to.not.be.undefined;
                        expect(res.length).to.equal(2);
                        expect(res[0].getId()).to.equal("id1"); //May break due to order
                        expect(res[1].getId()).to.equal("id2");
                    });
                });
            });

        });
    });

    describe("updateSubmission()",() => {
    
        it("Should update an submission database object if {id} is valid");
        
        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {
            var submission = new Submission("test","test");
            return expect(testSubmissionDAO.updateSubmission(submission)).to.eventually.be.rejectedWith("Error: Cannot update: A submission with the given ID does not exist in the database");
        });
    });

    describe("deleteSubmission()",() => {

        it("Should be able to delete an submission database object",() => {

            var submission = new Submission("test","test");
            return expect(testSubmissionDAO.createSubmission(submission.getName(), submission.getAssignmentId())).to.eventually.be.fulfilled.then((createRes) => {

                Submission.getStaticModel().findOne({_id:submission.getId()}).then((firstFindRes) =>{

                    expect(firstFindRes).to.not.be.undefined;
                     
                    return expect(testSubmissionDAO.deleteSubmission(submission.getId())).to.eventually.be.fulfilled.then((deleteRes) => {
                        Submission.getStaticModel().findOne({_id:submission.getId()}).then((secondFindRes) =>{
                            expect(secondFindRes).to.be.undefined;               
                        });
                    });
                });
            });
        });
    
        it("Should throw an appropriate error if {id} is invalid",() => {
            var nonPersistedSubmission = new Submission("test","test")
            return expect(testSubmissionDAO.deleteSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Error: Cannot delete: A submission with the given ID does not exist in the database");
        });
    }); 
});