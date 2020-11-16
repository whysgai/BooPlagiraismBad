import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import { ISubmissionDAO, SubmissionDAO } from "../src/model/SubmissionDAO";
import { ISubmissionManager, SubmissionManager } from "../src/manager/SubmissionManager";
import { ISubmission, Submission } from "../src/model/Submission";
import { IAssignmentDAO } from "../src/model/AssignmentDAO";

describe("SubmissionManager.ts",() => {

    var testSubmissionDAO : ISubmissionDAO;
    var testSubmissionManager : ISubmissionManager;
    var testSubmission : ISubmission;
    var testSubmissionId : String;
    var testSubmissionName : String;
    var testSubmissionAssignmentId : String;

    before(()=>{
        chai.use(chaiSpies); 
    });

    beforeEach(()=>{
        testSubmissionDAO = new SubmissionDAO();
        testSubmissionManager = new SubmissionManager(testSubmissionDAO);
        testSubmissionId = "test_sid";
        testSubmissionName = "testname";
        testSubmissionAssignmentId = "test_aid";
        testSubmission = new Submission(testSubmissionId,testSubmissionName);
    });

    describe("getSubmission()",() => {
        
        it("Should return submission if the provided ID is valid",()=> {
            var mockReadSubmission = chai.spy.on(testSubmissionDAO,'readSubmission',() =>{return testSubmission});

            testSubmissionManager.getSubmission(testSubmissionId).then((submission) => {
                expect(mockReadSubmission).to.have.been.called.with(testSubmissionId);
                expect(submission).to.deep.equal(testSubmission);
            })
        });

        it("Should throw an error if there is no submission with the provided ID",() =>{
            testSubmissionManager.getSubmission("some_nonexistent_id").then((res) => {
                expect(true,"getSubmission is succeeding where it should fail (id should not exist)").to.equal(false);
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.contains("No submission exists with id");
            });
        });

    });
    describe("getSubmissions()",() => {
        
        it("Should return submissions of the given assignment if there are some",()=> {
            var mockReadSubmission = chai.spy.on(testSubmissionDAO,'readSubmissions',() =>{return [testSubmission]});

            testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissions) => {
                expect(submissions[0]).to.deep.equal(testSubmission);
                expect(mockReadSubmission).to.have.been.called.with(testSubmissionAssignmentId);
            })
        });

        it("Should return no submissions if there are none",() =>{
            expect(testSubmissionManager.getSubmissions(testSubmissionAssignmentId)).to.be.an("array").that.is.empty;
        });        

    });

    describe("createSubmission()",() => {
        
        it("Should properly create a submission if body parameters are correct");

        it("Should return an appropriate error if body parameters are incorrect");

    });

    describe("updateSubmission()",() => {
        
        it("Should properly update a submission if body parameters are correct and {id} exists");

        it("Should return an appropriate error if {id} does not exist");

        it("Should return an appropriate error if body parameters are incorrect but {id} exists");

    });

    describe("addFile()",() =>{

        it("Should save and add a file into the submission specified by the client");

        it("Should return an appropriate error if body parameters are incorrect (submission specified does not exist or is invalid)");

        it("Should return an appropriate error if body parameters are incorrect (submission specified exists, but one or more other parameters is invalid)");
    
    });

    describe("deleteSubmission({id})",() =>{

        it("Should properly instruct SubmissionDAO to delete a submission if the specified {id} is valid",() =>{
            
            var mockReadSubmission = chai.spy.on(testSubmissionDAO,'readSubmission',() =>{return testSubmission});

            var mockDeleteSubmission = chai.spy.on(testSubmissionDAO,'deleteSubmission'); 
            
            testSubmissionManager.deleteSubmission(testSubmissionId).then(() => {
                expect(mockReadSubmission).to.have.been.called.with(testSubmissionId);
                expect(mockDeleteSubmission).to.have.been.called.with(testSubmission);
            });
        });
        
        it("Should throw an appropriate error if {id} is invalid",() => {
            var mockReadSubmission = chai.spy.on(testSubmissionDAO,'readSubmission',() =>{throw new Error("No submission found with id")});

            var mockDeleteSubmission = chai.spy.on(testSubmissionDAO,'deleteSubmission'); 
            
            testSubmissionManager.deleteSubmission(testSubmissionId).then(res => {
                expect(true,"deleteSubmission is succeeding where it should fail (ID should not exist)").to.be.false;
            }).catch((err) => {
                expect(mockReadSubmission).to.have.been.called.with(testSubmissionId);
                expect(mockDeleteSubmission).to.not.have.been.called;
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.contains("No submission exists with id");
            });
        });
    });

    describe("compareSubmission({id_a},{id_b})",()=> {

        it("Should return a valid AnalysisResult if both {id}s are valid");

        it("Should return an appropriate error if {id_a} is valid and {id_b} is not valid");
        
        it("Should return an appropriate error if {id_a} is not valid and {id_b} is valid");
        
        it("Should return an appropriate error if neither ids is valid");

    });
});
