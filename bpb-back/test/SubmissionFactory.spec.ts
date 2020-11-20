import {SubmissionFactory} from "../src/model/SubmissionFactory"
import { expect } from "chai";

describe.skip("SubmissionFactory.ts",() => {
    
    describe("buildSubmission()",() => {
        it("Should return a valid Submission with the expected properties",() => {
            var name = "testname";
            var assignment_id = "testaid"

            var submission = SubmissionFactory.buildSubmission(name,assignment_id);

            expect(submission).is.not.undefined;
            expect(submission.getName()).to.equal(assignment_id);
            expect(submission.getAssignmentId()).to.equal(assignment_id);
        });
    });
});