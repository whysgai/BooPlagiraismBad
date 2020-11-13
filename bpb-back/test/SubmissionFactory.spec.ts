import {SubmissionFactory} from "../src/SubmissionFactory"
import {Submission} from "../src/Submission"
import { expect } from "chai";

describe.skip("SubmissionFactory.ts",() => {
    
    describe("buildSubmission()",() => {
        it("Should return a valid Submission with the expected properties",() => {

            var factory = new SubmissionFactory();
            var id = "test";
            var name = "testname";
            var submission = factory.buildSubmission(id,name);
            expect(submission).is.not.undefined;
            expect(submission.getId()).to.equal(id);
            expect(submission.getName()).to.equal(name);
        });
    });
});