import { expect } from "chai";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { ISubmission, Submission } from "../src/model/Submission";
import { readFileSync } from 'fs';

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
            expect(testSubmissionNoEntries.getEntries()).to.deep.equal(new Map<string, IAnalysisResultEntry>());
            var entries = new Map<string, IAnalysisResultEntry[]>().set("someFileName", [new AnalysisResultEntry("1","2","3","4",5,6,7,8,"9","10")]);
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
            testSubmissionBuilder.setEntries(new Map<string, IAnalysisResultEntry[]>().set("someFileName", [new AnalysisResultEntry("1","2","someFileName","4",5,6,7,8,"9","10")]));
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

        it("Should throw an appropriate error message if the provided model is missing one or more properties",() => {
            expect(() => { testSubmissionBuilder.buildFromExisting({}); }).to.throw("At least one required model property is not present on the provided model");
        });
    });
});


describe("Submission.ts",() => {

    var testSubmissionA : ISubmission;
    var testSubmissionB : ISubmission;
    var testFileContent : string;
    var testEntryA : IAnalysisResultEntry;
    var testEntryB : IAnalysisResultEntry;

    beforeEach(()=>{
        var builderA = new Submission.builder();
        builderA.setName("name_a");
        builderA.setAssignmentId("id_a");
        testSubmissionA = builderA.build();

        var builderB = new Submission.builder();
        builderB.setName("name_b");
        builderB.setAssignmentId("id_b");
        testSubmissionB = builderB.build();

        testFileContent = "reallylongstringwithplentyofcontenttoexceedtheminimumlengthrequiredinordertohavesufficientlevelsofdifferencetobemeasurable";
        testEntryA = new AnalysisResultEntry("are1", testSubmissionA.getId(),"file.java","method",1, 0, 100, 1,"1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");
        testEntryB = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, "890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","void() {}");
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

    describe("compare()",() => {

        it("Should return a valid AnalysisResult[] with expected values if comparator submission is valid (left direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            var resultA = testSubmissionA.compare(testSubmissionB);
            expect(resultA).to.not.be.undefined;
            let asJSON = resultA[0].asJSON() as any;
            expect(asJSON['similarityScore']).to.be.equal(0); //the two hashes will not match, so simscore will be 0
            let files = new Map(asJSON['files']);
            expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
            expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
            expect(asJSON['matches'].length).to.be.equal(0);
        });
        
        it("Should return a valid AnalysisResult[] with expected values if comparator submission is valid (right direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            var resultB = testSubmissionB.compare(testSubmissionA);
            expect(resultB).to.not.be.undefined;
            let asJSON = resultB[0].asJSON() as any;
            expect(asJSON['similarityScore']).to.be.equal(0); //the two hashes will not match, so simscore will be 0%
            let files = new Map(asJSON['files']);
            expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
            expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
            expect(asJSON['matches'].length).to.be.equal(0);
        });

        it("Should return a valid AnalysisResult[] with expected values for submissions who share all identical hashes", () => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            let testEntryC = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, 
            "1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");//same hash as testEntryA
            testSubmissionB.addAnalysisResultEntry(testEntryC);
            var resultB = testSubmissionB.compare(testSubmissionA);
            expect(resultB).to.not.be.undefined;
            let asJSON = resultB[0].asJSON() as any;
            expect(asJSON['similarityScore']).to.be.equal(1); //the two hashes will match, so simscore will be 100%
            let files = new Map(asJSON['files']);
            expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
            expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
            expect(asJSON['matches'].length).to.be.equal(1);
            expect(asJSON['matches'][0]).to.have.deep.members([testEntryA, testEntryC]);
        });

        it("Should return a valid AnalysisResult[] with expected values for submissions that share one identical hash pair, and one non-matching hash pair", () => {
            let testEntryC = new AnalysisResultEntry("are1", testSubmissionA.getId(),"file.java","method",1, 0, 100, 1,
            "4567894567894567894567894567894567894567894567894567894567894567894567","void() {}");          
            let testEntryD = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, 
            "1234567123456712345671234567123456712345671234567123456712345671234567","void() {}"); //same hash as testEntryA
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            testSubmissionA.addAnalysisResultEntry(testEntryC);
            testSubmissionB.addAnalysisResultEntry(testEntryD);//Matches hash of testEntryA
            var resultB = testSubmissionB.compare(testSubmissionA);
            expect(resultB).to.not.be.undefined;
            let asJSON = resultB[0].asJSON() as any;
            expect(asJSON['similarityScore']).to.be.equal(.5); //one pair of hashes will match, the other will not, so 50% similarity
            let files = new Map(asJSON['files']);
            expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
            expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
            expect(asJSON['matches'].length).to.be.equal(1);
            expect(asJSON['matches'][0]).to.have.deep.members([testEntryA, testEntryD]);
        });
       
        it("Should throw an appropriate error if comparator submission is invalid (no AREs)",() =>{
            expect(function() {testSubmissionA.compare(testSubmissionB)}).to.throw("Cannot compare: One or more comparator submissions has no entries");
        });

        it("Should throw an appropriate error if comparator submission is invalid (left has no ARE)",() => {
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            expect(function() { testSubmissionA.compare(testSubmissionB)}).to.throw("Cannot compare: One or more comparator submissions has no entries");
        });
        
        it("Should throw and appropriate error if comparator submission is invalid (right has no ARE)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(function() { testSubmissionB.compare(testSubmissionA)}).to.throw("Cannot compare: One or more comparator submissions has no entries");
        });

        it("Contents of returned array should hold the proper filename mapping.", () => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            var results = testSubmissionB.compare(testSubmissionA);
            expect(results[0].getFiles().get(testSubmissionA.getId())).to.be.equal(testEntryA.getFileName());
            expect(results[0].getFiles().get(testSubmissionB.getId())).to.be.equal(testEntryB.getFileName());
        });

        it("Should not throw an error when two similar hashValues are compared.", () => {
            let testEntryC = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, testEntryA.getHashValue(),"void() {}");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryC);
            let compare = () => testSubmissionB.compare(testSubmissionA);
            expect(compare).to.not.throw(Error);
        });

        it("Should not throw an error when Submission.files contains the same filename twice.", () => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            let newSubAFiles = testSubmissionA.getFiles();
            let subADuplicateFile = newSubAFiles[0];
            newSubAFiles.push(subADuplicateFile);
            testSubmissionA.setFiles(newSubAFiles);
            let compare1 = () => testSubmissionB.compare(testSubmissionA);
            let compare2 = () => testSubmissionA.compare(testSubmissionB);
            expect(compare1).to.not.throw(Error);
            expect(compare2).to.not.throw(Error);
        });

        it("Should not throw an error when a submission contains two entries from two different files.", () => {
            let testEntryC = new AnalysisResultEntry("are1", testSubmissionA.getId(),"file.javaa","method",1, 0, 100, 1,"1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");
            let testEntryD = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.javab","method",2, 3, 30, 4, "890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","void() {}");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            testSubmissionA.addAnalysisResultEntry(testEntryC);
            testSubmissionB.addAnalysisResultEntry(testEntryD);
            let compare1 = () => testSubmissionB.compare(testSubmissionA);
            let compare2 = () => testSubmissionA.compare(testSubmissionB);
            expect(compare1).to.not.throw(Error);
            expect(compare2).to.not.throw(Error);
        });

        it("Should recognize a match for two nodes that share an identical hash value", () => {
            let testEntryC = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, "1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryC);
            let analysisResults = testSubmissionA.compare(testSubmissionB);
            expect(analysisResults.length).to.equal(1);
            expect(analysisResults[0].getMatches()).to.deep.equal([[testEntryA, testEntryC]]);
        });

        it("Should return a similarity score of 1 for two identical files.", () => {
            let filePath = '/vagrant/bpb-back/test/res/javaExample.java';
            testSubmissionA.addFile(readFileSync(filePath).toString(), 'javaExample.java');
            testSubmissionB.addFile(readFileSync(filePath).toString(), 'javaExample.java');
            let analysisResults = testSubmissionA.compare(testSubmissionB);
            expect(analysisResults[0].getSimilarityScore()).to.equal(1);
        })
    });
    
    describe("addFile()",() => {
        
        it("Should successfully add new file contents to the submission if input is valid",() => {
            return testSubmissionA.addFile(testFileContent,testEntryA.getFileName()).then(() => {
                expect(testSubmissionA.getEntries()).to.not.be.deep.equal(new Map<string, IAnalysisResultEntry[]>());
            });
        });

        it("Should throw an appropriate error if the specified file was already added to the submission",() => {
            var expectedErrorMsg = "Submission file " + testEntryA.getFileName() + " was already added to the submission";

            return testSubmissionA.addFile(testFileContent,testEntryA.getFileName()).then(() => {
                testSubmissionA.addFile("the same file ",testEntryA.getFileName()).then(() => {
                    expect(true,"addFile should be failing (specified file already added)").to.equal(false);
                }).catch((err) => {
                    expect(err).to.have.property("message").which.equals(expectedErrorMsg);
                });
            });
        });
    });

    describe("addAnalysisResultEntry()",() => {
        it("Should add an AnalysisResultEntry to the submission",() => {
            expect(testSubmissionA.getEntries()).to.deep.equal(new Map<string, IAnalysisResultEntry[]>());
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(testSubmissionA.getEntries()).to.deep.equal(new Map<string, IAnalysisResultEntry[]>().set(testEntryA.getFileName(), [testEntryA]));
        });;
    });

    describe("asJSON()",() => {
        it("Should return an object with the expected properties",() => {
            
            var expectedJSON = {
                "_id": testSubmissionA.getId(),
                "assignment_id": testSubmissionA.getAssignmentId(),
                "entries": [...new Map().set(testEntryA.getFileName(), [testEntryA]).set(testEntryB.getFileName(), [testEntryB])],
                "files": [testEntryA.getFileName(),testEntryB.getFileName()],
                "name": testSubmissionA.getName() 
            }            
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionA.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});