
import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import { AppConfig } from "../src/AppConfig";

var mongoose = require('mongoose');
import { Connection } from "mongoose";
var MockMongoose = require('mock-mongoose').MockMongoose;

import { ISubmissionDAO, SubmissionDAO } from "../src/SubmissionDAO";
import submissionModel from "../src/SubmissionModel";

describe("SubmissionDAO.ts",() => {

    var mockMongoose : any;
    var connection : Connection;
    var testSubmissionDAO : ISubmissionDAO;

    before(() => {
            chai.use(chaiSpies);

            //TODO: Unclear whether this works properly.
            mockMongoose = new MockMongoose(mongoose);
            mockMongoose.prepareStorage().then(()=> {
                mongoose.connect(AppConfig.dbConnectionString(), {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
                   connection = mongoose.connection;
                });
            });
    });

    beforeEach(()=>{
        testSubmissionDAO = new SubmissionDAO(mockMongoose.connection);
    });

    describe("createSubmission()",() => {

        //TODO: This doesn't actually work right now. Or does it?
        it.skip("Should create an submission database object if inputs are valid",()=>{
            testSubmissionDAO.createSubmission(); 
            submissionModel.find().then((res) => {
                expect(res).to.be.not.null;
            });
        });
    
        it("Should throw an appropriate error if inputs are invalid");
    });

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid");
    
        it("Should throw an appropriate error when trying to update a nonexistent database object");
    });

    describe("updateSubmission()",() => {
    
        it("Should update an submission database object if {id} is valid");
    
        it("Should throw an appropriate error if {id} is invaliddeleteSubmission()");
    
        it("Should be able to delete an submission database object");
    
        it("Should throw an appropriate error if {id} is invalid");
    }); 
});