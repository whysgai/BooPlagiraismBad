import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { AnalysisResultEntry } from "../src/model/AnalysisResultEntry";
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

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((submission) => {
                SubmissionDAO.readSubmission(submission.getId()).then((readSubmission) => {
                    expect(readSubmission.getName()).to.equal(submission.getName());
                    expect(readSubmission.getId()).to.equal(submission.getId());
                });
            });
        });
    
        it("Should throw an appropriate error if {id} of submission to be read is invalid",() => {
            var nonPersistedSubmission = new Submission.builder().build(); 
            return expect(SubmissionDAO.readSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Cannot find: No submission with the given id exists in the database");
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

    describe("updateSubmission()",() => {
    
        it("Should update an submission database object if {id} is valid",() => {
            
            //New values to assign after creation
            var updatedName = "Newer Name";
            var updatedAssignmentId = "Newer Assignment Id";
            var updatedEntries = [new AnalysisResultEntry("1","2","3","4",5,6,7,8,"9","10")];
            var updatedFiles = ["some_new_file"];

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createdSubmission) => {
                
                //Ensure created submission starts with expected default values
                expect(createdSubmission.getId()).to.not.be.undefined;
                expect(createdSubmission.getName()).to.equal(testSubmission.getName());
                expect(createdSubmission.getAssignmentId()).to.equal(testSubmission.getAssignmentId());
                expect(createdSubmission.getFiles()).to.be.empty;
                expect(createdSubmission.getEntries()).to.be.empty
                
                //Update created Submission
                createdSubmission.setName(updatedName);
                createdSubmission.setAssignmentId(updatedAssignmentId);
                createdSubmission.setFiles(updatedFiles)
                createdSubmission.setEntries(updatedEntries);

                SubmissionDAO.updateSubmission(createdSubmission).then((updatedSubmission) => {
                    
                    //Expect updates to be returned on pass-through
                    expect(updatedSubmission.getId()).to.deep.equal(createdSubmission.getId())
                    expect(updatedSubmission.getName()).to.deep.equal(updatedName);
                    expect(updatedSubmission.getAssignmentId()).to.deep.equal(updatedAssignmentId)
                    expect(updatedSubmission.getFiles()).to.deep.equal(updatedFiles);
                    expect(updatedSubmission.getEntries()).to.deep.equal(updatedEntries);

                    SubmissionDAO.readSubmission(createdSubmission.getId()).then((readUpdatedSubmission) => {
                        
                        //Expect updates to be returned on read
                        expect(readUpdatedSubmission.getId()).to.deep.equal(createdSubmission.getId())
                        expect(readUpdatedSubmission.getName()).to.deep.equal(updatedName);
                        expect(readUpdatedSubmission.getAssignmentId()).to.deep.equal(updatedAssignmentId)
                        expect(readUpdatedSubmission.getFiles()).to.deep.equal(updatedFiles);
                        expect(readUpdatedSubmission.getEntries()).to.deep.equal(updatedEntries);
                    });
                });
            });
        });
        
        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {
            var newSubmission = new Submission.builder().build();
            return expect(SubmissionDAO.updateSubmission(newSubmission)).to.eventually.be.rejectedWith("Cannot update: No submission with the given id exists in the database");
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
            return expect(SubmissionDAO.deleteSubmission("nonexistent")).to.eventually.be.rejectedWith("Cannot delete: A submission with the given ID does not exist in the database");
        });
    }); 
});