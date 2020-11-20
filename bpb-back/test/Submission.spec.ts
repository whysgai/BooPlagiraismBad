import { expect } from "chai";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { ISubmission, Submission } from "../src/model/Submission";

describe("Submission.ts.SubmissionBuilder",() => {

    var testSubmission : ISubmission;
    var testSubmissionBuilder : any;

    beforeEach(() => {
        testSubmissionBuilder = new Submission.builder();
    });

    describe("setName()",() => {
        it("Should correctly set submission's name",() => {
           var newName = "some_test";
           testSubmissionBuilder.setName(newName);
           testSubmission = testSubmissionBuilder.build();
           expect(testSubmission.getName()).to.equal(newName);
        });
    });

    describe("setAssignmentId()",() => {

        it("Should correctly set submission's assignment ID",() => {
            var newAssignmentId = "some_assignment_id";
            testSubmissionBuilder.setAssignmentId(newAssignmentId);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getAssignmentId()).to.equal(newAssignmentId);
        });
    });

    describe("setFiles()",() => {
        it("Should correctly set submission's files",() => {
            var files = ["some","test","files"];
            testSubmissionBuilder.setFiles(files);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getFiles()).to.equal(files);
        });
    });

    describe("setEntries()",() => {
        it("Should correctly set submission's entries",() => {
            var testSubmissionNoEntries = testSubmissionBuilder.build();
            expect(testSubmission.getEntries()).to.deep.equal([]);

            var entries = [new AnalysisResultEntry("1","2","3","4",5,6,7,8,"9","10")];
            testSubmissionBuilder.setEntries(entries);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getEntries()).to.equal(entries);
        });
    });

    describe("build()",() => {
        it("Should correctly build a submission if no builder methods are called",() => {
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getId()).to.not.be.undefined;
            expect(testSubmission.getName()).to.not.be.undefined;
            expect(testSubmission.getAssignmentId()).to.not.be.undefined;
            expect(testSubmission.getModelInstance()).to.not.be.undefined;
        });
        it("Should correctly build a submission if builder methods are called",() => {
            var newName = "some_other_name";
            var newAssignmentId = "some_other_id";
            testSubmissionBuilder.setName(newName);
            testSubmissionBuilder.setAssignmentId(newAssignmentId);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getId()).to.equal(testSubmission.getModelInstance().id);
            expect(testSubmission.getName()).to.equal(newName);
            expect(testSubmission.getAssignmentId()).to.equal(newAssignmentId);
            expect(testSubmission.getFiles()).to.be.empty;
            expect(testSubmission.getEntries()).to.be.empty;
        });
    });

    describe("buildFromExisting()",() => {
        it("Should correctly build a submission from an existing database model",() => {
            var newName = "some_other_name";
            var newAssignmentId = "some_other_id";
            testSubmissionBuilder.setName(newName);
            testSubmissionBuilder.setAssignmentId(newAssignmentId);
            testSubmissionBuilder.setFiles(["some","files"]);
            testSubmissionBuilder.setEntries([new AnalysisResultEntry("1","2","3","4",5,6,7,8,"9","10")]);
            testSubmission = testSubmissionBuilder.build();
            var testExistingModel = testSubmission.getModelInstance();

            var testSubmissionBuilderExisting = new Submission.builder();
            var testSubmissionExisting = testSubmissionBuilderExisting.buildFromExisting(testExistingModel);
            expect(testSubmissionExisting.getId()).to.deep.equal(testSubmission.getId());
            expect(testSubmissionExisting.getName()).to.deep.equal(testSubmission.getName());
            expect(testSubmissionExisting.getAssignmentId()).to.deep.equal(testSubmission.getAssignmentId());
            expect(testSubmissionExisting.getEntries()).to.deep.equal(testSubmission.getEntries());
            expect(testSubmissionExisting.getFiles()).to.deep.equal(testSubmission.getFiles());
        });
    });
});


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
            expect(testSubmissionA.getId()).to.equal(testSubmissionA.getModelInstance().id);
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
    
    describe.skip("addFile()",() => {
        //TODO: Un-skip once Visitor is implemented
        //Can't mock because visitors are created in Submission
        it("Should successfully add new file contents to the submission if input is valid",() => {
            return testSubmissionA.addFile(testEntryA.getText(),testEntryA.getFilePath()).then(() => {
                expect(testSubmissionA.getEntries().length).to.be.greaterThan(0);
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
            expect(testSubmissionA.getEntries()).to.deep.equal([]);
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(testSubmissionA.getEntries()).to.deep.equal([testEntryA]);
        });;
    });

    describe("asJSON()",() => {
        it("Should return an object with the expected properties",() => {
            
            var expectedJSON = {
                "_id": testSubmissionA.getId(),
                "assignment_id": testSubmissionA.getAssignmentId(),
                "entries": [testEntryA.asJSON(),testEntryB.asJSON()],
                "files": [testEntryA.getFilePath(),testEntryB.getFilePath()],
                "name": testSubmissionA.getName() 
            }

            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionA.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});