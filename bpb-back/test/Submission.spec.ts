import { expect } from "chai";
import { ISubmission } from "../src/model/Submission";
import { SubmissionFactory } from "../src/model/SubmissionFactory";

describe("Submission.ts",() => {

    var testSubmissionA : ISubmission;
    var testSubmissionB : ISubmission;

    beforeEach(()=>{
        testSubmissionA = SubmissionFactory.buildSubmission("id_a","name_a");
        testSubmissionB = SubmissionFactory.buildSubmission("id_b","name_b");
    });

    describe("getId()",() => {
        it("Should return the submission’s id",() => {
            expect(testSubmissionA.getId()).to.equal("id_a");
        });
    });
    describe("getName()",() => {
        it("Should return the submission’s name",() => {
            expect(testSubmissionA.getName()).to.equal("name_a");
        });
    });

    describe("compare()",() => {
        it("Should return a valid AnalysisResult if comparator submission is valid (left direction)",() => {
            //testSubmissionA.addFile(); //TODO: Add AREs
            //testSubmissionB.addFile(); //TODO: Add AREs
            var resultA = testSubmissionA.compare(testSubmissionB);
            expect(resultA).to.not.be.undefined;
            expect(resultA.asJSON).to.not.be.be.undefined;
        });
        
        it("Should return a valid AnalysisResult if comparator submission is valid (right direction)",() => {
            //testSubmissionA.addFile(): //TODO: Add AREs
            //testSubmissionB.addfile(): //TODO: Add AREs
            var resultB = testSubmissionB.compare(testSubmissionA);
            expect(resultB).to.not.be.undefined;
            expect(resultB.asJSON()).to.not.be.undefined;
        });
       
        it("Should throw an appropriate error if comparator submission is invalid (no AREs)",() =>{
            expect(testSubmissionA.compare(testSubmissionB)).to.throw();
        });

        it("Should throw an appropriate error if comparator submission is invalid (left has no ARE)",() => {
            //testSubmissionB.addFile(); //TODO: Add AREs to B only
            expect(testSubmissionA.compare(testSubmissionB)).to.throw();
            var resultA = testSubmissionA.compare(testSubmissionB);
        });
        
        it("Should throw and appropriate error if comparator submission is invalid (right has no ARE)",() => {
            //testSubmissionA.addFile(): //TODO: Add AREs to A only
            expect(testSubmissionB.compare(testSubmissionA)).to.throw();
        });

    });
});
