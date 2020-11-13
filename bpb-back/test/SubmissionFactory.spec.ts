import {SubmissionFactory} from "../src/model/SubmissionFactory"
import {Submission} from "../src/model/Submission"
import { expect } from "chai";

describe.skip("SubmissionFactory.ts",() => {
    
    describe("buildSubmission()",() => {
        it("Should return a valid Submission with the expected properties",() => {

            var id = "test";
            var name = "testname";
            var submission = SubmissionFactory.buildSubmission(id,name);
            expect(submission).is.not.undefined;
            expect(submission.getId()).to.equal(id);
            expect(submission.getName()).to.equal(name);
        });
    });
});