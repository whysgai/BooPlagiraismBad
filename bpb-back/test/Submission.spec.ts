import chai, { expect } from "chai";
import chaiSpies from "chai-spies";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { ISubmission, Submission } from "../src/model/Submission";
import { readFileSync } from 'fs';
import fs from 'fs';
import util from 'util';
const readFileContent = util.promisify(fs.readFile);

describe("Submission.ts.SubmissionBuilder",() => {

    let testSubmission : ISubmission;
    let testSubmissionBuilder : any;

    beforeEach(() => {
        testSubmissionBuilder = new Submission.builder();
    });

    describe("setName()",() => {
        it("Should correctly set submission's name",() => {
           let newName = "some_test";
           testSubmissionBuilder.setName(newName);
           testSubmission = testSubmissionBuilder.build();
           expect(testSubmission.getName()).to.equal(newName);
        });
    });

    describe("setAssignmentId()",() => {

        it("Should correctly set submission's assignment ID",() => {
            let newAssignmentId = "some_assignment_id";
            testSubmissionBuilder.setAssignmentId(newAssignmentId);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getAssignmentId()).to.equal(newAssignmentId);
        });
    });

    describe("setFiles()",() => {
        it("Should correctly set submission's files",() => {
            let files = ["some","test","files"];
            testSubmissionBuilder.setFiles(files);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getFiles()).to.deep.equal(files);
            expect(testSubmission.getFiles()).to.not.equal(files);
        });
    });

    describe("setFileConents", () => {
        it("Should correctly set submission's fileContents", () => {
            let fileContents = ["your father was an elderberry","your mother smelt of hamsters"];

            testSubmissionBuilder.setFileContents(fileContents);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getFileContents()).to.deep.equal(fileContents);
            expect(testSubmission.getFileContents()).to.not.equal(fileContents);
        });
    });

    describe("setEntries()",() => {
        it("Should correctly set submission's entries",() => {
            let testSubmissionNoEntries = testSubmissionBuilder.build();
            expect(testSubmissionNoEntries.getEntries()).to.deep.equal(new Map<string, IAnalysisResultEntry>());
            let entries = new Map<string, IAnalysisResultEntry[]>().set("someFileName", [new AnalysisResultEntry("1","2","3","4",5,6,7,8,"9","10")]);
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
            expect(testSubmission.getEntries()).to.not.be.undefined;
            expect(testSubmission.getFileContents()).to.not.be.undefined;
        });
        it("Should correctly build a submission if builder methods are called",() => {
            let newName = "some_other_name";
            let newAssignmentId = "some_other_id";
            testSubmissionBuilder.setName(newName);
            testSubmissionBuilder.setAssignmentId(newAssignmentId);
            testSubmission = testSubmissionBuilder.build();
            expect(testSubmission.getId()).to.equal(testSubmission.getModelInstance().id);
            expect(testSubmission.getName()).to.equal(newName);
            expect(testSubmission.getAssignmentId()).to.equal(newAssignmentId);
            expect(testSubmission.getFiles()).to.be.empty;
            expect(testSubmission.getEntries()).to.be.empty;
            expect(testSubmission.getFileContents()).to.be.empty;
        });
    });

    describe("buildFromExisting()",() => {
        it("Should correctly build a submission from an existing database model",() => {
            let newName = "some_other_name";
            let newAssignmentId = "some_other_id";
            testSubmissionBuilder.setName(newName);
            testSubmissionBuilder.setAssignmentId(newAssignmentId);
            testSubmissionBuilder.setFiles(["some","files"]);
            testSubmissionBuilder.setEntries(new Map<string, IAnalysisResultEntry[]>().set("someFileName", [new AnalysisResultEntry("1","2","someFileName","4",5,6,7,8,"9","10")]));
            testSubmissionBuilder.setFileContents(["sir lancelot of camelot","robin the somewhat brave"]);
            testSubmission = testSubmissionBuilder.build();
            let testExistingModel = testSubmission.getModelInstance();

            let testSubmissionBuilderExisting = new Submission.builder();
            let testSubmissionExisting = testSubmissionBuilderExisting.buildFromExisting(testExistingModel);
            expect(testSubmissionExisting.getId()).to.deep.equal(testSubmission.getId());
            expect(testSubmissionExisting.getName()).to.deep.equal(testSubmission.getName());
            expect(testSubmissionExisting.getAssignmentId()).to.deep.equal(testSubmission.getAssignmentId());
            expect(testSubmissionExisting.getEntries()).to.deep.equal(testSubmission.getEntries());
            expect(testSubmissionExisting.getFiles()).to.deep.equal(testSubmission.getFiles());
            expect(testSubmissionExisting.getFileContents()).to.deep.equal(testSubmission.getFileContents());
        });

        it("Should throw an appropriate error message if the provided model is missing one or more properties",() => {
            expect(() => { testSubmissionBuilder.buildFromExisting({}); }).to.throw("At least one required model property is not present on the provided model");
        });
    });
});


describe("Submission.ts",() => {

    let testSubmissionA : ISubmission;
    let testSubmissionB : ISubmission;
    let testFileContent : string;
    let testEntryA : IAnalysisResultEntry;
    let testEntryB : IAnalysisResultEntry;
    let testFileContents : string[];

    before(() => {
        chai.use(chaiSpies);
    });

    beforeEach(() => {

        testFileContent = "reallylongstringwithplentyofcontenttoexceedtheminimumlengthrequiredinordertohavesufficientlevelsofdifferencetobemeasurable";
        testFileContents = ["five is","right out!"]

        let builderA = new Submission.builder();
        builderA.setName("name_a");
        builderA.setAssignmentId("id_a");
        builderA.setFileContents(testFileContents);
        testSubmissionA = builderA.build();

        let builderB = new Submission.builder();
        builderB.setName("name_b");
        builderB.setAssignmentId("id_b");
        testSubmissionB = builderB.build();

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

    describe("getFileContents", () => {
        it("Should return the Submission's fileContents Map", () => {
            expect(testSubmissionA.getFileContents()).to.deep.equal(testFileContents);
        });
    });
    
    describe("compare()",() => {

        it("Should return a valid AnalysisResult[] with expected values if comparator submission is valid (left direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            
            return testSubmissionA.compare(testSubmissionB).then((resultA) => {
                expect(resultA).to.not.be.undefined;
                let asJSON = resultA[0].asJSON() as any;
                expect(asJSON['similarityScore']).to.equal(0); //the two hashes will not match, so simscore will be 0
                
                let files = new Map(asJSON['files']);
                expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
                expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
                expect(asJSON['matches'].length).to.equal(0);
            });
            
        });

        it("Should return a valid AnalysisResult[] with expected values if comparator submission is valid (right direction)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            return testSubmissionB.compare(testSubmissionA).then((resultB)=> {
                expect(resultB).to.not.be.undefined;
                let asJSON = resultB[0].asJSON() as any;
                expect(asJSON['similarityScore']).to.equal(0);
                let files = new Map(asJSON['files']);
                expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
                expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
                expect(asJSON['matches'].length).to.equal(0);
            });
        });

        it("Should return a valid AnalysisResult[] with expected values for submissions who share all identical hashes", () => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            let testEntryC = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, 
            "1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");//same hash as testEntryA
            testSubmissionB.addAnalysisResultEntry(testEntryC);
            return testSubmissionB.compare(testSubmissionA).then((resultB) => { 
                    expect(resultB).to.not.be.undefined;
                let asJSON = resultB[0].asJSON() as any;
                expect(asJSON['similarityScore']).to.be.equal(1); //the two hashes will match, so simscore will be 100%
                let files = new Map(asJSON['files']);
                expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
                expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
                expect(asJSON['matches'].length).to.not.equal(0);
                expect(asJSON['matches'][0]).to.have.deep.members([testEntryA, testEntryC]);
                });
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
            
            testSubmissionB.compare(testSubmissionA).then((resultB) => {
                expect(resultB).to.not.be.undefined;
                let asJSON = resultB[0].asJSON() as any;
                expect(asJSON['similarityScore']).to.be.equal(.5); //one pair of hashes will match, the other will not, so 50% similarity
                let files = new Map(asJSON['files']);
                expect(files.get(testEntryA.getSubmissionID())).to.be.equal(testEntryA.getFileName());
                expect(files.get(testEntryB.getSubmissionID())).to.be.equal(testEntryB.getFileName());
                expect(asJSON['matches'].length).to.be.equal(1);
                expect(asJSON['matches'][0]).to.have.deep.members([testEntryA, testEntryD]);
            });
        });
        
        it("Should throw an appropriate error if comparing internal entries fails",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);

            let mockCompareAnalysisResultEntries = chai.spy.on(testSubmissionA,'compareAnalysisResultEntries',() => {return Promise.reject(new Error("Inner compare failed"))});

            return testSubmissionA.compare(testSubmissionB).then(() => {
                expect(true,"compareAnalysisResultEntries to have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Inner compare failed");
                expect(mockCompareAnalysisResultEntries).to.have.been.called.once;
            })
        });

        it("Should throw an appropriate error if comparator submission is invalid (no AREs)",() =>{
            expect(testSubmissionA.compare(testSubmissionB)).to.eventually.be.rejected.with("Cannot compare: One or more comparator submissions has no entries");
        });

        it("Should throw an appropriate error if comparator submission is invalid (left has no ARE)",() => {
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.compare(testSubmissionB)).to.eventually.be.rejected.with("Cannot compare: One or more comparator submissions has no entries");
        });
        
        it("Should throw and appropriate error if comparator submission is invalid (right has no ARE)",() => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            expect(testSubmissionB.compare(testSubmissionA)).to.eventually.be.rejected.with("Cannot compare: One or more comparator submissions has no entries");
        });

        it("Contents of returned array should hold the proper filename mapping.", () => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            testSubmissionB.compare(testSubmissionA).then((results) => {
                expect(results[0].getFiles().get(testSubmissionA.getId())).to.be.equal(testEntryA.getFileName());
                expect(results[0].getFiles().get(testSubmissionB.getId())).to.be.equal(testEntryB.getFileName());
            });
        });

        it("Should not throw an error when two similar hashValues are compared.", () => {
            let testEntryC = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, testEntryA.getHashValue(),"void() {}");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryC);
            expect(testSubmissionB.compare(testSubmissionA)).to.eventually.be.fulfilled;
        });

        it("Should not throw an error when Submission.files contains the same filename twice.", () => {
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            let newSubAFiles = testSubmissionA.getFiles();
            let subADuplicateFile = newSubAFiles[0];
            newSubAFiles.push(subADuplicateFile);
            testSubmissionA.setFiles(newSubAFiles);
            expect(testSubmissionB.compare(testSubmissionA)).to.eventually.be.fulfilled;
            expect(testSubmissionA.compare(testSubmissionB)).to.eventually.be.fulfilled;
        });

        it("Should not throw an error when a submission contains two entries from two different files.", () => {
            let testEntryC = new AnalysisResultEntry("are1", testSubmissionA.getId(),"file.javaa","method",1, 0, 100, 1,"1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");
            let testEntryD = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.javab","method",2, 3, 30, 4, "890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","void() {}");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryB);
            testSubmissionA.addAnalysisResultEntry(testEntryC);
            testSubmissionB.addAnalysisResultEntry(testEntryD);
            expect(testSubmissionB.compare(testSubmissionA)).to.eventually.be.fulfilled;
            expect(testSubmissionA.compare(testSubmissionB)).to.eventually.be.fulfilled;
        });

        it("Should recognize a match for two nodes that share an identical hash value", () => {
            let testEntryC = new AnalysisResultEntry("are2", testSubmissionB.getId(),"filey.java","method",2, 3, 30, 4, "1234567123456712345671234567123456712345671234567123456712345671234567","void() {}");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionB.addAnalysisResultEntry(testEntryC);
            return testSubmissionA.compare(testSubmissionB).then((analysisResults) => {
                expect(analysisResults.length).to.equal(1);
                expect(analysisResults[0].getMatches()).to.deep.equal([[testEntryA, testEntryC]]);
            });
        });

        it("Should return a similarity score of 1 for two identical files.", () => {
            let filePath = '/vagrant/bpb-back/test/res/javaExample.java';
            testSubmissionA.addFile(readFileSync(filePath).toString(), 'javaExample.java');
            testSubmissionB.addFile(readFileSync(filePath).toString(), 'javaExample.java');
            return testSubmissionA.compare(testSubmissionB).then((analysisResults) => {
                expect(analysisResults[0].getSimilarityScore()).to.equal(1);
            });
        });

        it("Should properly filter out a matched analysisResult if one of the fileA contains a match on on the same lines.", () => {
            let hash1 = "1234567123456712345671234567123456712345671234567123456712345671234567";
            let testEntryA = new AnalysisResultEntry("ARE-A", testSubmissionA.getId(), "someFile.txt", "MethodContext", 1, 0, 5, 10, hash1, "Bigbird is a giant yellow bird");
            let testEntryB = new AnalysisResultEntry("ARE-B", testSubmissionA.getId(), "someFile.txt", "MethodDeclContext", 1, 0, 5, 10, hash1, "who just hangs out with children.");
            let testEntryC = new AnalysisResultEntry("ARE-C", testSubmissionA.getId(), "someFile.txt", "AnyOtherContext", 20, 0, 40, 10, hash1, "Do we know what big bird consumes for food in the wild?");
            let testEntryD = new AnalysisResultEntry("ARE-D", testSubmissionB.getId(), "someOtherFile.txt", "MethodContext", 1, 0, 5, 10, hash1, "Why are we not more concerned for");
            let testEntryE = new AnalysisResultEntry("ARE-E", testSubmissionB.getId(), "someOtherFile.txt", "AnyOtherContext", 20, 0, 40, 10, hash1, "the safety of the children in their proximity?");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionA.addAnalysisResultEntry(testEntryB);
            testSubmissionA.addAnalysisResultEntry(testEntryC);
            testSubmissionB.addAnalysisResultEntry(testEntryD);
            testSubmissionB.addAnalysisResultEntry(testEntryE);
            
            return testSubmissionA.compare(testSubmissionB).then((analysisResults) => {
                expect(analysisResults[0].getMatches().length).to.be.equal(2);
                expect(analysisResults[0].getMatches()[0]).to.have.deep.members([testEntryC, testEntryE]);
                expect(analysisResults[0].getMatches()[1]).to.have.deep.members([testEntryA, testEntryD]);
            });
        });

        it("Should properly filter out a matched analysisResult if one of the fileB contains a match on on the same lines.", () => {
            let hash1 = "1234567123456712345671234567123456712345671234567123456712345671234567";
            let testEntryA = new AnalysisResultEntry("ARE-A", testSubmissionA.getId(), "someFile.txt", "MethodContext", 1, 0, 5, 10, hash1, "Bigbird is a giant yellow bird");
            let testEntryB = new AnalysisResultEntry("ARE-B", testSubmissionA.getId(), "someFile.txt", "MethodDeclContext", 1, 0, 5, 10, hash1, "who just hangs out with children.");
            let testEntryC = new AnalysisResultEntry("ARE-C", testSubmissionA.getId(), "someFile.txt", "AnyOtherContext", 20, 0, 40, 10, hash1, "Do we know what big bird consumes for food in the wild?");
            let testEntryD = new AnalysisResultEntry("ARE-D", testSubmissionB.getId(), "someOtherFile.txt", "MethodContext", 1, 0, 5, 10, hash1, "Why are we not more concerned for");
            let testEntryE = new AnalysisResultEntry("ARE-E", testSubmissionB.getId(), "someOtherFile.txt", "AnyOtherContext", 20, 0, 40, 10, hash1, "the safety of the children in their proximity?");
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionA.addAnalysisResultEntry(testEntryB);
            testSubmissionA.addAnalysisResultEntry(testEntryC);
            testSubmissionB.addAnalysisResultEntry(testEntryD);
            testSubmissionB.addAnalysisResultEntry(testEntryE);
            
            return testSubmissionB.compare(testSubmissionA).then((analysisResults) => {
                expect(analysisResults[0].getMatches().length).to.be.equal(2);
                expect(analysisResults[0].getMatches()[0]).to.have.deep.members([testEntryC, testEntryE]);
                expect(analysisResults[0].getMatches()[1]).to.have.deep.members([testEntryA, testEntryD]);
            });
        });
    });
    
    describe("addFile()",() => {
        
        it("Should successfully add new file contents to the submission if input is valid",() => {
            return testSubmissionA.addFile(testFileContent,testEntryA.getFileName()).then(() => {
                expect(testSubmissionA.getEntries()).to.not.be.deep.equal(new Map<string, IAnalysisResultEntry[]>());
            });
        });

        it("Should throw an appropriate error if the specified file was already added to the submission",() => {
            let expectedErrorMsg = "Submission file " + testEntryA.getFileName() + " was already added to the submission";

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
            
            let expectedJSON = {
                "_id": testSubmissionA.getId(),
                "assignment_id": testSubmissionA.getAssignmentId(),
                "entries": [...new Map().set(testEntryA.getFileName(), [testEntryA]).set(testEntryB.getFileName(), [testEntryB])],
                "files": [testEntryA.getFileName(),testEntryB.getFileName()],
                "fileContents": [...testSubmissionA.getFileContents()],
                "name": testSubmissionA.getName() 
            }            
            testSubmissionA.addAnalysisResultEntry(testEntryA);
            testSubmissionA.addAnalysisResultEntry(testEntryB);
            expect(testSubmissionA.asJSON()).to.deep.equal(expectedJSON);
        });
    });
});