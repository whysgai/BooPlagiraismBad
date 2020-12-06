import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { AppConfig } from "../src/AppConfig";
import { SubmissionManager } from "../src/manager/SubmissionManager";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import {ISubmission, Submission} from "../src/model/Submission";

var mongoose = require('mongoose');

import { SubmissionDAO } from "../src/model/SubmissionDAO";

describe("SubmissionDAO.ts",() => {

    let testSubmission : ISubmission;
    let testSubmissionName : string;
    let testAssignmentId : string;

    before((done) => {
        chai.use(chaiAsPromised);
        testAssignmentId = "testassignmentid";
        testSubmissionName = "testsubmissionname";

        //TODO: Replace this (and beforeEach) with database mock (or something more elegant)
        //This is really fragile!
        mongoose.connect(AppConfig.dbConnectionString(), {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(() => {
            done();
        });
    });

    beforeEach((done)=>{

        //Restore global prototype mocks
        chai.spy.restore(Submission.getStaticModel());

        mongoose.connection.collections.submissions.drop(() => {

            let builder = new Submission.builder();
            builder.setName(testSubmissionName);
            builder.setAssignmentId(testAssignmentId);
            testSubmission = builder.build();
          
            done();
        });
    });

    after((done) => {
        mongoose.connection.close();
        done();
    });

    describe("createSubmission()",() => {

        it("Should create an submission database object if inputs are valid",()=> {
           
            return SubmissionDAO.createSubmission(testSubmission.getName(),testSubmission.getAssignmentId()).then((submission) => {
                
                expect(submission.getName()).to.equal(testSubmission.getName());
                expect(submission.getId()).to.not.be.undefined;

                return Submission.getStaticModel().findOne({"_id":submission.getId()}).then((document) => {
                    expect(document).to.have.property("name").which.equals(submission.getName());
                    expect(document).to.have.property("assignment_id").which.deep.equals(submission.getAssignmentId());
                    expect(document).to.have.property("entries").which.deep.equals([...submission.getEntries()]);
                    expect(document).to.have.property("files").which.deep.equals(submission.getFiles());
                    expect(document).to.have.property("fileContents").which.deep.equals(submission.getFileContents());
                });
            });
        });

        it("Should throw an appropriate error if object can't be saved",() => {

            chai.spy.on(Submission.getStaticModel().prototype,'save',() => {return Promise.reject(new Error("Cannot save"))});

            return expect(SubmissionDAO.createSubmission(testSubmission.getName(),testSubmission.getAssignmentId())).to.eventually.be.rejectedWith("Cannot save");
        });
    });

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((submission) => {
                
                let entries = new Map<string,IAnalysisResultEntry[]>();
                entries.set("exampleJava.java",[new AnalysisResultEntry("","1","exampleJava.java","method",1,2,3,4,"5","6")])
                let files = ["exampleJava.java"];
                let fileContents = ["void test(){}"];
                
                submission.setFiles(files);
                submission.setFileContents(fileContents);
                submission.setEntries(entries);

                return SubmissionDAO.updateSubmission(submission).then((updatedSubmission) => {
                    return SubmissionDAO.readSubmission(submission.getId()).then((readSubmission) => {
                        expect(readSubmission.getName()).to.equal(submission.getName());
                        expect(readSubmission.getId()).to.equal(submission.getId());
                        expect(readSubmission.getFiles()).to.deep.equal(files);
                        expect(readSubmission.getEntries()).to.deep.equal(entries);
                        expect(readSubmission.getFileContents()).to.deep.equal(fileContents);
                    });
                });
            });
        });
    
        it("Should throw an appropriate error if {id} of submission to be read is invalid",() => {
            let nonPersistedSubmission = new Submission.builder().build(); 
            return expect(SubmissionDAO.readSubmission(nonPersistedSubmission.getId())).to.eventually.be.rejectedWith("Cannot find: No submission with the given id exists in the database");
        });

        it("Should throw an appropriate error if database find fails",() => {
            chai.spy.on(Submission.getStaticModel(),'findOne',() => { return Promise.reject(new Error("Cannot findOne"))});
            return expect(SubmissionDAO.readSubmission(testSubmission.getId())).to.eventually.be.rejectedWith("Cannot findOne");
        });
    });

    describe("readSubmissions()",() => {

        it("should return an empty array of submissions if no submissions exist with the specified assignment id",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((res) => {
                return SubmissionDAO.readSubmissions("invalidId").then(submissions => {
                    expect(submissions).to.deep.equal([]);
                });
            });
        });

        it("should return all submissions with the provided assignmentid if some exist", () => {
            let testSubmission2 = new Submission.builder().build(); 

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createdSubmission) => {
                
                return SubmissionDAO.createSubmission(testSubmission2.getName(), testSubmission.getAssignmentId()).then((createdSubmission2) => {

                    return SubmissionDAO.readSubmissions(testSubmission.getAssignmentId()).then((submissions) => {
                        expect(submissions[0].getId()).to.deep.equal(createdSubmission.getId());
                        expect(submissions[0].getName()).to.deep.equal(createdSubmission.getName());
                        expect(submissions[0].getAssignmentId()).to.deep.equal(createdSubmission.getAssignmentId());
                        expect(submissions[0].getEntries()).to.deep.equal(createdSubmission.getEntries());
                        expect(submissions[0].getFiles()).to.deep.equal(createdSubmission.getFiles());
                        expect(submissions[0].getFileContents()).to.deep.equal(createdSubmission.getFileContents());

                        expect(submissions[1].getId()).to.deep.equal(createdSubmission2.getId());
                        expect(submissions[1].getName()).to.deep.equal(createdSubmission2.getName());
                        expect(submissions[1].getAssignmentId()).to.deep.equal(createdSubmission2.getAssignmentId());
                        expect(submissions[1].getEntries()).to.deep.equal(createdSubmission2.getEntries());
                        expect(submissions[1].getFiles()).to.deep.equal(createdSubmission2.getFiles());
                        expect(submissions[1].getFileContents()).to.deep.equal(createdSubmission2.getFileContents());
                    });
                });
            });
        });
        
        it("Should throw an appropriate error if database find fails",() => {
            chai.spy.on(Submission.getStaticModel(),'find',() => { return Promise.reject(new Error("Cannot find"))});
            return expect(SubmissionDAO.readSubmissions("someid")).to.eventually.be.rejectedWith("Cannot find");
        });

        it("Should throw an appropriate error if returned submissions can't be built (can't map model results)",() => {
            chai.spy.on(Submission.getStaticModel(),'find',() => { return Promise.resolve([{}])});
            return expect(SubmissionDAO.readSubmissions("someid")).to.eventually.be.rejectedWith("At least one required model property is not present on the provided model");
        });
    });

    describe("updateSubmission()",() => {

        it("Should update an submission database object if {id} is valid",() => {
            
            //New values to assign after creation
            let updatedName = "Newer Name";
            let updatedAssignmentId = "Newer Assignment Id";
            let updatedFileName = "some_new_file"
            let updatedEntries = new Map<string, IAnalysisResultEntry[]>().set(updatedFileName, [new AnalysisResultEntry("1","2",updatedFileName,"4",5,6,7,8,"9","10")] )
            let updatedFiles = [updatedFileName];
            let updatedFileContents = ["void testy(){}"];

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createdSubmission) => {
                
                //Ensure created submission starts with expected default values
                expect(createdSubmission.getId()).to.not.be.undefined;
                expect(createdSubmission.getName()).to.equal(testSubmission.getName());
                expect(createdSubmission.getAssignmentId()).to.equal(testSubmission.getAssignmentId());
                expect(createdSubmission.getFiles()).to.be.empty;
                expect(createdSubmission.getEntries()).to.be.empty;
                expect(createdSubmission.getFileContents()).to.be.empty;
                
                //Update created Submission
                createdSubmission.setName(updatedName);
                createdSubmission.setAssignmentId(updatedAssignmentId);
                createdSubmission.setFiles(updatedFiles)
                createdSubmission.setEntries(updatedEntries);
                createdSubmission.setFileContents(updatedFileContents)

                return SubmissionDAO.updateSubmission(createdSubmission).then((updatedSubmission) => {
                   
                    //Expect updates to be returned on pass-through
                    expect(updatedSubmission.getId()).to.deep.equal(createdSubmission.getId())
                    expect(updatedSubmission.getName()).to.deep.equal(updatedName);
                    expect(updatedSubmission.getAssignmentId()).to.deep.equal(updatedAssignmentId)
                    expect(updatedSubmission.getFiles()).to.deep.equal(updatedFiles);
                    expect(updatedSubmission.getEntries()).to.deep.equal(updatedEntries);
                    expect(updatedSubmission.getFileContents()).to.deep.equal(updatedFileContents);

                    return SubmissionDAO.readSubmission(createdSubmission.getId()).then((readUpdatedSubmission) => {
                        
                        //Expect updates to be returned on read
                        expect(readUpdatedSubmission.getId()).to.deep.equal(createdSubmission.getId())
                        expect(readUpdatedSubmission.getName()).to.deep.equal(updatedName);
                        expect(readUpdatedSubmission.getAssignmentId()).to.deep.equal(updatedAssignmentId)
                        expect(readUpdatedSubmission.getFiles()).to.deep.equal(updatedFiles);
                        expect(readUpdatedSubmission.getEntries()).to.deep.equal(updatedEntries);
                        expect(readUpdatedSubmission.getFileContents()).to.deep.equal(updatedFileContents);
                    });
                });
            });
        });

        it("Should throw an appropriate error if no submissions exist in the database with the specified id",() => {
            let newSubmission = new Submission.builder().build();
            return SubmissionDAO.updateSubmission(newSubmission).then(updatedSubmission => {
                expect(true,"updateSubmission should have failed, but it succeeded").to.equal(false);
            }).catch((err) =>{
                expect(err).to.have.property("message").which.contains("Cannot update: No submission with the given id exists in the database");
            });
        });

        it("Should throw an appropriate error if database findOne fails during update",() => {
            chai.spy.on(Submission.getStaticModel(),'findOne',() => { return Promise.reject(new Error("Cannot findOne"))});
            return expect(SubmissionDAO.updateSubmission(testSubmission)).to.eventually.be.rejectedWith("Cannot findOne");
        });

        it("Should throw an appropriate error if database findOneAndUpdate fails during update",() => { 
            chai.spy.on(Submission.getStaticModel(),'findOneAndUpdate',() => { return Promise.reject(new Error("Cannot findOneAndUpdate"))});
            
            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createdSubmission) => {
                return expect(SubmissionDAO.updateSubmission(createdSubmission)).to.eventually.be.rejectedWith("Cannot findOneAndUpdate");
            });
        });
    });

    describe("deleteSubmission()",() => {

        it("Should be able to delete a submission database object",() => {

            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createRes) => {

                return Submission.getStaticModel().findOne({_id:createRes.getId()})
                .then((firstFindRes) =>{               
                    expect(firstFindRes).to.have.property("name").which.equals(testSubmission.getName());

                    return SubmissionDAO.deleteSubmission(createRes.getId()).then((deleteRes) => {
                        
                        return Submission.getStaticModel().findOne({_id:createRes.getId()}).then((secondFindRes) => {
                            expect(secondFindRes).to.be.null;
                        });                     
                    });
                });
            });
        });
    
        it("Should throw an appropriate error if {id} specified for deletion is invalid",() => {
            let newSubmission = new Submission.builder().build();
            return expect(SubmissionDAO.deleteSubmission(newSubmission.getId())).to.eventually.be.rejectedWith("Cannot delete: No submission with the given id exists in the database");
        });

        it("Should throw an appropriate error if database findOne fails during deletion",() => {
            chai.spy.on(Submission.getStaticModel(),'findOne',() => { return Promise.reject(new Error("Cannot findOne"))});
            return expect(SubmissionDAO.deleteSubmission(testSubmission.getId())).to.eventually.be.rejectedWith("Cannot findOne");
        });

        it("Should throw an appropriate error if database findOneAndDelete fails during deletion",() => { 
            chai.spy.on(Submission.getStaticModel(),'findOneAndDelete',() => { return Promise.reject(new Error("Cannot findOneAndDelete"))});
            
            return SubmissionDAO.createSubmission(testSubmission.getName(), testSubmission.getAssignmentId()).then((createdSubmission) => {
                return expect(SubmissionDAO.deleteSubmission(createdSubmission.getId())).to.eventually.be.rejectedWith("Cannot findOneAndDelete");
            });
        });
    }); 
});