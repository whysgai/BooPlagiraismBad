
import { expect } from "chai";
import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiSpies = require("chai-spies");
import { AppConfig } from "../src/AppConfig";

var mongoose = require('mongoose');

import { ISubmissionDAO, SubmissionDAO } from "../src/SubmissionDAO";
import submissionModel from "../src/SubmissionModel";

describe("SubmissionDAO.ts",() => {

    var testSubmissionDAO : ISubmissionDAO;

    before((done) => {
        chai.use(chaiAsPromised);
        mongoose.connect(AppConfig.dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            done();
        });
    });

    beforeEach((done)=>{
        //TODO: Replace this with database mock (or something more elegant)
        mongoose.connection.collections.submissions.drop(() => {
            testSubmissionDAO = new SubmissionDAO();
            done();
        })
    });

    describe("createSubmission()",() => {

        it("Should create an submission database object if inputs are valid (ID doesn't exist)",()=> {
            
            return testSubmissionDAO.createSubmission("testid").then((res) => {
                submissionModel.findOne({_id:"testid"}).then((res) => {
                    expect(res).to.not.be.undefined;
                });
            });
        });
    
        it("Should throw an appropriate error if inputs are invalid (ID exists)",() => {
            
            return expect(testSubmissionDAO.createSubmission("testduplicateid")).to.eventually.be.fulfilled.then((res) => {
                expect(testSubmissionDAO.createSubmission("testduplicateid")).to.eventually.be.rejectedWith("Error: A submission with the given ID exists in the database already.");
            });
        });
    });

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid");
    
        it("Should return an empty collection if no submissions exist in the database");
    });

    describe("updateSubmission()",() => {
    
        it("Should update an submission database object if {id} is valid");
    
        it("Should throw an appropriate error if {id} is invalid()");
    });

    describe("deleteSubmission()",() => {
        it("Should be able to delete an submission database object",() => {

            var id = "test"
            return expect(testSubmissionDAO.createSubmission(id)).to.eventually.be.fulfilled.then((createRes) => {

                submissionModel.findOne({_id:id}).then((firstFindRes) =>{

                    expect(firstFindRes).to.not.be.undefined;
                     
                    return expect(testSubmissionDAO.deleteSubmission(id)).to.eventually.be.fulfilled.then((deleteRes) => {
                        submissionModel.findOne({_id:id}).then((secondFindRes) =>{
                            expect(secondFindRes).to.be.undefined;               
                        });
                    });
                });
            });
        });
    
        it("Should throw an appropriate error if {id} is invalid",() => {
            return expect(testSubmissionDAO.deleteSubmission("some_nonexistent_id")).to.eventually.be.rejectedWith("A submission with the given ID does not exist in the database");
        });
    }); 
});