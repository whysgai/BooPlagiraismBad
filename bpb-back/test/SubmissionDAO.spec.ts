import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import {ISubmission, Submission} from "../src/model/Submission";

var mongoose = require('mongoose');

import { SubmissionDAO } from "../src/model/SubmissionDAO";

describe("SubmissionDAO.ts",() => {

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
                
                expect(submission.getName()).to.equal(testSubmission.getName());
                expect(submission.getId()).to.not.be.undefined;

                Submission.getStaticModel().findOne({"name":testSubmission.getName()}).then((document) => {
                    expect(document).to.have.property("name").which.equals(testSubmission.getName());
                    expect(document.id).to.equal(submission.getId());
                });
            });
        });
    });

    describe.skip("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((submission) => {
                SubmissionDAO.readSubmission(submission.getId()).then((readSubmission) => {
                    expect(readSubmission.getName()).to.equal(testSubmission.getName());
                    expect(readSubmission.getId()).to.equal(testSubmission.getId());
                });
            });
        });
    
        it("Should throw an appropriate error if {id} specified for update is invalid",() => {
            var nonPersistedSubmission = new Submission.builder().build(); 
            return expect(SubmissionDAO.readSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Error: Cannot find: A submission with the given ID does not exist in the database");
        });
    });

    describe("readSubmissions()",() => {

        it("should throw an appropriate error if the provided assignment id is invalid",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((res) => {
                expect(SubmissionDAO.readSubmissions("invalidId")).to.eventually.be.rejectedWith("Cannot find: No submissions with the given assignment id exist in the database");
            });
        });

        it("should return all submissions that exist in the database", () => {
            var testSubmission2 = new Submission.builder().build(); 

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createdSubmission) => {
                
                SubmissionDAO.createSubmission(testSubmission2.getName(), testSubmission.getAssignmentId()).then((createdSubmission2) => {

                    expect(SubmissionDAO.readSubmissions(testSubmission.getAssignmentId())).to.eventually.be.fulfilled.then((submissions) => {
                        expect(submissions.length).to.equal(2);
                        expect(submissions[0].getId()).to.equal(createdSubmission.getId());
                        expect(submissions[1].getId()).to.equal(createdSubmission2.getId());
                    });
                });
            });

        });
    });

    describe.skip("updateSubmission()",() => {
    
        it("Should update an submission database object if {id} is valid"); //TODO
        
        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {
            return expect(SubmissionDAO.updateSubmission(testSubmission)).to.eventually.be.rejectedWith("Error: Cannot update: A submission with the given ID does not exist in the database");
        });
    });

    describe.skip("deleteSubmission()",() => {

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
    
        it("Should throw an appropriate error if {id} specified for deletion is invalid",() => {
            return expect(SubmissionDAO.deleteSubmission("nonexistent")).to.eventually.be.rejectedWith("Error: Cannot delete: A submission with the given ID does not exist in the database");
        });
    }); 
});