import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import { ISubmissionDAO, SubmissionDAO } from "../src/model/SubmissionDAO";
import { ISubmissionManager, SubmissionManager } from "../src/model/SubmissionManager";
import { Submission } from "../src/model/Submission";

describe("SubmissionManager.ts",() => {

    var testSubmissionDAO : ISubmissionDAO;
    var testSubmissionManager : ISubmissionManager;

    before(()=>{
        chai.use(chaiSpies); 
    });

    beforeEach(()=>{
        testSubmissionDAO = new SubmissionDAO(); //TODO: may need to replace null with actual connection (?)
        testSubmissionManager = new SubmissionManager(testSubmissionDAO);
    });

    describe("getSubmissions()",() => {
        
        it.skip("Should return submissions if there are some",()=> {

                const mockSubmission = new Submission("test","test");
                chai.spy.on(testSubmissionDAO,'readSubmissions',() =>{return [mockSubmission]});

                expect(testSubmissionManager.getSubmissions("test")).to.be.an('array').that.is.not.empty;
        });

        it.skip("Should return no submissions if there are none",() =>{
            expect(testSubmissionManager.getSubmissions("test")).to.be.an('array').that.is.empty;
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

        it("Should save and add a frontend-”encoded” file into the submission specified by the client");

        it("Should return an appropriate error if body parameters are incorrect (submission specified does not exist or is invalid)");

        it("Should return an appropriate error if body parameters are incorrect (submission specified exists, but one or more other parameters is invalid)");
    
    });

    describe("deleteSubmission({id})",() =>{

        //TODO: This is not a very good test.
        it.skip("Should properly instruct SubmissionDAO to delete a submission if the specified {id} is valid",() =>{
           
            var deleteSubmission = chai.spy.on(testSubmissionDAO,'deleteSubmission'); 
            
            testSubmissionManager.deleteSubmission(new Submission("test","test"));
            
            expect(deleteSubmission).to.have.been.called();
        });
        
        it("Should throw an appropriate error if {id} is invalid");
    
    });

    describe("compareSubmission({id_a},{id_b})",()=> {

        it("Should return a valid AnalysisResult if both {id}s are valid");

        it("Should return an appropriate error if {id_a} is valid and {id_b} is not valid");
        
        it("Should return an appropriate error if {id_a} is not valid and {id_b} is valid");
        
        it("Should return an appropriate error if neither ids is valid");

    });
});
