
import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import {ISubmission, Submission} from "../src/model/Submission";

var mongoose = require('mongoose');

import { ISubmissionDAO, SubmissionDAO } from "../src/model/SubmissionDAO";

describe("SubmissionDAO.ts",() => {

    var testSubmissionDAO : ISubmissionDAO;
    var testSubmission : ISubmission;
    var testSubmissionName : string;
    var testAssignmentId : string;

    before((done) => {
        chai.use(chaiAsPromised);
        testAssignmentId = "testassignmentid";
        testSubmissionName = "testsubmissionname";

        //TODO: Replace this (and beforeEach) with database mock (or something more elegant)
        //This is really fragile!
        mongoose.connect("mongodb://127.0.0.1:27017/bpbtest", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            done();
        });
    });

    beforeEach((done)=>{
        mongoose.connection.collections.submissions.drop(() => {
            testSubmissionDAO = new SubmissionDAO();
            var sb = new Submission.builder();
            sb.setName(testSubmissionName);
            sb.setAssignmentId(testAssignmentId);
            testSubmission = sb.build();
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

            var nonPersistedSubmission = SubmissionFactory.buildSubmission("test","test");
            nonPersistedSubmission.setId("testide"); 
            return expect(testSubmissionDAO.readSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Error: Cannot find: A submission with the given ID does not exist in the database");
        });
    });

    describe("readSubmissions()",() => {

        it("should throw an appropriate error if the provided assignment id is invalid",() => {

            return testSubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((res) => {
                expect(testSubmissionDAO.readSubmissions("invalidId")).to.eventually.be.rejectedWith("Error: Cannot find: A submission with one of the given IDs does not exist in the database");
            });
        });

        it("should return all submissions that exist in the database", () => {
            var assignmentId = "2";
            var submission2 = SubmissionFactory.buildSubmission("test2","test2"); 

            return testSubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((res) => {
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
            return expect(testSubmissionDAO.updateSubmission(testSubmission)).to.eventually.be.rejectedWith("Error: Cannot update: A submission with the given ID does not exist in the database");
        });
    });

    describe("deleteSubmission()",() => {

        it("Should be able to delete an submission database object",() => {

            return testSubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createRes) => {

                Submission.getStaticModel().findOne({_id:createRes.getId()}).then((firstFindRes) =>{

                    expect(firstFindRes).to.not.be.undefined;
                     
                    return expect(testSubmissionDAO.deleteSubmission(testSubmission.getId())).to.eventually.be.fulfilled.then((deleteRes) => {
                        Submission.getStaticModel().findOne({_id:createRes.getId()}).then((secondFindRes) =>{
                            expect(secondFindRes).to.be.undefined;               
                        });
                    });
                });
            });
        });
    
        it("Should throw an appropriate error if {id} is invalid",() => {
            return expect(testSubmissionDAO.deleteSubmission("nonexistent")).to.eventually.be.rejectedWith("Error: Cannot delete: A submission with the given ID does not exist in the database");
        });
    }); 
});