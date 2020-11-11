import { expect } from "chai";
import { AssignmentFactory } from "../src/AssignmentFactory";

describe("AssignmentFactory.ts",() => {

    describe("buildAssignment()",() => {
        it("Should return a valid Assignment with the expected properties",() => {

            var factory = new AssignmentFactory();
            var assignment = factory.buildAssignment("a","b");

            expect(assignment.getID()).to.equal("a");
            expect(assignment.getName()).to.equal("b");
            expect(assignment.getSubmissionIDs()).to.be.empty;
        });
    });
});