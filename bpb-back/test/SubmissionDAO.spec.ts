import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import {ISubmission, Submission} from "../src/model/Submission";

var mongoose = require('mongoose');

import { SubmissionDAO } from "../src/model/SubmissionDAO";

describe.skip("SubmissionDAO.ts",() => {

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
            var sb = new Submission.builder();
            sb.setName(testSubmissionName);
            sb.setAssignmentId(testAssignmentId);
            testSubmission = sb.build();
            done();
        });
    });

    describe("createSubmission()",() => {

        it("Should create an submission database object if inputs are valid",()=> {
           
            return SubmissionDAO.createSubmission(testSubmission.getName(),testSubmission.getAssignmentId()).then((submission) => {
                
                expect(submission).to.be.a("ISubmission").with.property("name").which.equals(testSubmission.getName());

                Submission.getStaticModel().findOne({"name":testSubmission.getName()}).then((document) => {
                    expect(document).to.be.an("ISubmission").with.property("name").which.equals(testSubmission.getName());
                });
            });
        });
    });

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((submission) => {
                SubmissionDAO.readSubmission(submission.getId()).then((readSubmission) => {
                    expect(readSubmission).to.be.an("ISubmission").with.property("name").which.equals(testSubmission.getName());
                });
            });
        });
    
        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {

            var nonPersistedSubmission = new Submission.builder().build(); 
            return expect(SubmissionDAO.readSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Error: Cannot find: A submission with the given ID does not exist in the database");
        });
    });

    describe("readSubmissions()",() => {

        it("should throw an appropriate error if the provided assignment id is invalid",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((res) => {
                expect(SubmissionDAO.readSubmissions("invalidId")).to.eventually.be.rejectedWith("Error: Cannot find: A submission with one of the given IDs does not exist in the database");
            });
        });

        it("should return all submissions that exist in the database", () => {
            var assignmentId = "2";
            var submission2 = new Submission.builder().build(); 

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((res) => {
                
                SubmissionDAO.createSubmission(submission2.getName(), submission2.getAssignmentId()).then((res2) => {

                    expect(SubmissionDAO.readSubmissions(assignmentId)).to.eventually.be.fulfilled.then((res) => {
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
    
        it("Should update an submission database object if {id} is valid"); //TODO
        
        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {
            return expect(SubmissionDAO.updateSubmission(testSubmission)).to.eventually.be.rejectedWith("Error: Cannot update: A submission with the given ID does not exist in the database");
        });
    });

    describe("deleteSubmission()",() => {

        it("Should be able to delete an submission database object",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createRes) => {

                Submission.getStaticModel().findOne({_id:createRes.getId()}).then((firstFindRes) =>{

                    expect(firstFindRes).to.not.be.undefined;
                     
                    SubmissionDAO.deleteSubmission(testSubmission.getId()).then((deleteRes) => {
                        Submission.getStaticModel().findOne({_id:createRes.getId()}).then((secondFindRes) =>{
                            expect(secondFindRes).to.be.undefined;               
                        });
                    });
                });
            });
        });
    
        it("Should throw an appropriate error if {id} is invalid",() => {
            return expect(SubmissionDAO.deleteSubmission("nonexistent")).to.eventually.be.rejectedWith("Error: Cannot delete: A submission with the given ID does not exist in the database");
        });
    }); 
});