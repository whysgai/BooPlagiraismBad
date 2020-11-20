import { expect } from "chai";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { ISubmission, Submission } from "../src/model/Submission";
describe("Submission.ts",() => {

    var testSubmissionA : ISubmission;
    var testSubmissionB : ISubmission;
    var testEntryA : IAnalysisResultEntry;
    var testEntryB : IAnalysisResultEntry;

    beforeEach(()=>{
        var sba = new Submission.builder();
        sba.setName("name_a");
        sba.setAssignmentId("id_a");
        testSubmissionA = sba.build();

        var sbb = new Submission.builder();
        sbb.setName("name_b");
        sbb.setAssignmentId("id_b");
        testSubmissionB = sbb.build();

        testEntryA = new AnalysisResultEntry("are1","subid_a","/home/file.java","method",1, 0, 100, 1,"haxrtwe","void() {}");
        testEntryB = new AnalysisResultEntry("are2","subid_b","/home/filey.java","method",2, 3, 30, 4, "reerwer","void() {}");
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
            expect(resultA.asJSON()).to.not.be.be.undefined;
        });
        
        it("Should return a valid AnalysisResult if comparator submission is valid (right direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            var resultB = testSubmissionB.compare(testSubmissionA);
            expect(resultB).to.not.be.undefined;
            expect(resultB.asJSON()).to.not.be.undefined;
        });
       
        it("Should throw an appropriate error if comparator submission is invalid (no AREs)",() =>{
            expect(function() {testSubmissionA.compare(testSubmissionB)}).to.throw("Cannot compare: A comparator submission has no entries");
        });

        it("Should throw an appropriate error if comparator submission is invalid (left has no ARE)",() => {
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            expect(function() { testSubmissionA.compare(testSubmissionB)}).to.throw("Cannot compare: A comparator submission has no entries");
        });
        
        it("Should throw and appropriate error if comparator submission is invalid (right has no ARE)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(function() { testSubmissionB.compare(testSubmissionA)}).to.throw("Cannot compare: A comparator submission has no entries");
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

    describe.skip("addFile()",() => {
        //TODO: Un-skip once Visitor is implemented
        //Can't mock because visitors are created in Submission
        it("Should successfully add new file contents to the submission if input is valid",() => {
            return testSubmissionA.addFile(testEntryA.getText(),testEntryA.getFilePath()).then(() => {
                expect(testSubmissionA.hasAnalysisResultEntries()).to.equal(true);
            });
        });

        it("Should throw an appropriate error if the specified file was already added to the submission",() => {
            var expectedErrorMsg = "File at " + testEntryA.getFilePath() + " was already added to the submission";

            return testSubmissionA.addFile(testEntryA.getText(),testEntryA.getFilePath()).then(() => {
                testSubmissionA.addFile("the same file ",testEntryA.getFilePath()).then(() => {
                    expect(true,"addFile should be failing (specified file already added)").to.equal(false);
                }).catch((err) => {
                    expect(err).to.have.property("message").which.equals(expectedErrorMsg);
                });
            });
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

            var expectedJSON = {
                "assignment_id": "id_a",
                "entries": [testEntryA.asJSON(),testEntryB.asJSON()],
                "files": [testEntryA.getFilePath(),testEntryB.getFilePath()],
                "name": "name_a"
            }

            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionA.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});
