import { expect } from "chai";
import { SubmissionFactory } from "../src/model/SubmissionFactory";

describe.skip("Submission.ts",() => {

    var id : String;
    var name : String;

    before(()=>{
        id = "TestID";
        name = "TestName";
    });

    describe("getId()",() => {
        it("Should return the submission’s id",() => {
            var submission = SubmissionFactory.buildSubmission(id,name);
            expect(submission.getId()).to.equal(id);
        });
    });

    describe("getName()",() => {
        it("Should return the submission’s name",() => {
            var submission = SubmissionFactory.buildSubmission(id,name);
            expect(submission.getName()).to.equal(name);
        });
    });

    describe("compare()",() => {
        it("Should return a valid AnalysisResult if comparator submission is valid",() => {
            var submissionA = SubmissionFactory.buildSubmission(id,name);
            var submissionB = SubmissionFactory.buildSubmission("id_b","name_b");
            var resultA = submissionA.compare(submissionB);
            expect(resultA).to.not.be.undefined;
            expect(resultA.asJSON).to.not.be.be.undefined;
            var resultB = submissionB.compare(submissionA);
            expect(resultB).to.not.be.undefined;
            expect(resultB.asJSON()).to.not.be.undefined;
        });
       
        //TODO: Determine if check required for submission with no ASTS (will this exist?)
        it("Should throw an appropriate error if comparator submission is invalid (null)",() =>{
            var submission = SubmissionFactory.buildSubmission(id,name);
            expect(submission.compare(undefined)).to.throw();
        });
    });
});
