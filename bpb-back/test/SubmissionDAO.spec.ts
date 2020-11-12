
import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import { AppConfig } from "../src/AppConfig";

var mongoose = require('mongoose');

import { ISubmissionDAO, SubmissionDAO } from "../src/SubmissionDAO";
import submissionModel from "../src/SubmissionModel";

describe("SubmissionDAO.ts",() => {

    var mockMongoose : any;
    var testSubmissionDAO : ISubmissionDAO;

    before((done) => {
        chai.use(chaiSpies);
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
            
            var id = "testid";

            return testSubmissionDAO.createSubmission(id).then((res) => {
                
                submissionModel.findOne({_id:id}).then((res) => {
                    expect(res).to.not.be.undefined;
                });
            });
        });
    
        it("Should throw an appropriate error if inputs are invalid (ID exists)");
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
        it("Should be able to delete an submission database object");
    
        it("Should throw an appropriate error if {id} is invalid");
    }); 
});