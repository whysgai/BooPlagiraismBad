import { expect } from "chai";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/AnalysisResultEntry";
import { ISubmission } from "../src/model/Submission";
import { SubmissionFactory } from "../src/model/SubmissionFactory";

describe("Submission.ts",() => {

    var testSubmissionA : ISubmission;
    var testSubmissionB : ISubmission;
    var testEntryA : IAnalysisResultEntry;
    var testEntryB : IAnalysisResultEntry;

    beforeEach(()=>{
        testSubmissionA = SubmissionFactory.buildSubmission("id_a","name_a");
        testSubmissionB = SubmissionFactory.buildSubmission("id_b","name_b");
        testEntryA = new AnalysisResultEntry("id_a","/home/file.java","method",1,100,"haxrtwe","void() {}");
        testEntryB = new AnalysisResultEntry("id_b","/home/filey.java","method",2,30,"reerwer","void() {}");
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

    //TODO: Add more tests when comparison is more mature
    describe("compare()",() => {
        it("Should return a valid AnalysisResult if comparator submission is valid (left direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            var resultA = testSubmissionA.compare(testSubmissionB);
            expect(resultA).to.not.be.undefined;
            expect(resultA.asJSON).to.not.be.be.undefined;
        });
        
        it("Should return a valid AnalysisResult if comparator submission is valid (right direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            var resultB = testSubmissionB.compare(testSubmissionA);
            expect(resultB).to.not.be.undefined;
            expect(resultB.asJSON()).to.not.be.undefined;
        });
       
        it("Should throw an appropriate error if comparator submission is invalid (no AREs)",() =>{
            expect(testSubmissionA.compare(testSubmissionB)).to.throw();
        });

        it("Should throw an appropriate error if comparator submission is invalid (left has no ARE)",() => {
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.compare(testSubmissionB)).to.throw();
            var resultA = testSubmissionA.compare(testSubmissionB);
        });
        
        it("Should throw and appropriate error if comparator submission is invalid (right has no ARE)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(testSubmissionB.compare(testSubmissionA)).to.throw();
        });

    });

    describe("hasAnalysisResultEntries()", () => {
        it("Should return false if the submission has no AREs",() => {
            expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(false);
        })

        it("Should return true if the submission has any AREs",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(true);
        })
    });

    describe("addFile()",() => {
        it("Should successfully add new file contents to the submission if input is valid",() => {
            expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(false);
            testSubmissionA.addFile(testEntryA.getText(),testEntryA.getFilePath());
            expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(true);
        });

        it("Should throw an appropriate error if the specified file was already added to the submission",() => {
            testSubmissionA.addFile(testEntryA.getText(),testEntryA.getFilePath());
            expect(testSubmissionA.addFile("some other file content",testEntryA.getFilePath())).to.throw(new Error("File at " + testEntryA.getFilePath() + " was already added to the submission"));
        });
    });

    describe("addAnalysisResultEntry()",() => {
        it("Should add an AnalysisResultEntry to the submission",() => {
            expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(false);
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(true);
        });;
    });

    describe("asJSON()",() => {
        it("Should return an object with the expected properties",() => {
            var expectedJSON = {}; //TODO
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});
