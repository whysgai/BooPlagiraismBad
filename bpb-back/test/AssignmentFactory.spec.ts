import { expect } from "chai";
import { AssignmentFactory } from "../src/model/AssignmentFactory";

describe.skip("AssignmentFactory.ts",() => {

    describe("buildAssignment()",() => {
        it("Should return a valid Assignment with the expected properties",() => {

            var assignment = AssignmentFactory.buildAssignment("a","b");

            expect(assignment.getID()).to.equal("a");
            expect(assignment.getName()).to.equal("b");
            expect(assignment.getSubmissionIDs()).to.be.empty;
        });
    });
});