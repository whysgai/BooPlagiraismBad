import { assert, expect } from "chai";
import { parse } from "java-ast";
var chai = require('chai');
var spies = require('chai-spies');
import Sinon from "sinon";
import { mapDefined } from "tslint/lib/utils";
import { AnalysisResult, IAnalysisResult } from "../src/model/AnalysisResult";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";

describe("AnalysisResult.ts", () => {
    var mockEntry1 : IAnalysisResultEntry;
    var mockEntry2 : IAnalysisResultEntry;
    var mockEntry3 : IAnalysisResultEntry;
    var mockEntry4 : IAnalysisResultEntry;
    
    //Used in our spy-ed functions
    var filename1 : string;
    var subId1 : string;
    var filename2 : string;
    var subId2 : string;
    var filename3 : string;
    var subId3 : string;
    var filename4 : string;
    var subId4 : string;
    
    var testSimilarityScore : number;
    var testAnalysisResult : IAnalysisResult;


    before(() => {
        chai.use(spies);

        mockEntry1 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry2 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry3 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry4 = Sinon.createStubInstance(AnalysisResultEntry);

        chai.spy.on(mockEntry1, 'getFileName', () => filename1);
        chai.spy.on(mockEntry1, 'getSubmissionID', () => subId1);
        chai.spy.on(mockEntry2, 'getFileName', () => filename2);
        chai.spy.on(mockEntry2, 'getSubmissionID', () => subId2);
        chai.spy.on(mockEntry3, 'getFileName', () => filename3);
        chai.spy.on(mockEntry3, 'getSubmissionID', () => subId3);
        chai.spy.on(mockEntry4, 'getFileName', () => filename4);
        chai.spy.on(mockEntry4, 'getSubmissionID', () => subId4);
        
        testSimilarityScore = 5;

        //Set these so our testAnalysisResult passes construction
        filename1 = 'testPath1';
        subId1 = 'testID1';
        filename2 = 'testPath2';
        subId2 = 'testID2'

        testAnalysisResult = new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, filename2);
    });

    
    describe("Constructor tests", async () => {

        beforeEach( async () => {
            filename1 = 'path1';
            subId1 = 'id1';
            filename2 = 'path2';
            subId2 = 'id2';
        });

        afterEach(() => {
            filename1 = 'path1';
            subId1 = 'id1';
            filename2 = 'path2';
            subId2 = 'id2';
            filename3 = 'path1';
            subId3 = 'id1';
            filename4 = 'path2';
            subId4 = 'id2';
        })
        
        it("Should successfuly construct.", () => {
            let goodConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, filename2);
            expect(goodConstructor).to.not.throw(Error);
        });

        it("Should throw an error if a sub-array representing a match is undefined.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], undefined], testSimilarityScore, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Bad Constructor: sub-array'matches[*]' must not be undefined.");
        });

        it("Should throw an error if an empty array is provided, and similarityScore is not 0", () => {
            let emptyArray = new Array<Array<IAnalysisResultEntry>>();
            let badConstructor = () => new AnalysisResult(emptyArray, 5, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Bad Constructor: if no matches are provided, param 'similarityScore' should be 0.");
        });

        it("Should NOT throw an error if an empty array is provided, and similarityScore is 0", () => {
            let emptyArray = new Array<Array<IAnalysisResultEntry>>();
            let badConstructor = () => new AnalysisResult(emptyArray, 0, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.not.throw(Error);            
        });

        it("Should throw an error if matches[*][0] is undefined.", () => {
            let badArray = new Array<Array<IAnalysisResultEntry>>();
            badArray.push([undefined, mockEntry2]);
            let badConstructor = () => new AnalysisResult(badArray, testSimilarityScore, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined.");
        });

        it("Should throw an error if matches[*][1] is undefined.", () => {
            let badArray = new Array<Array<IAnalysisResultEntry>>();
            badArray.push([mockEntry1, undefined]);
            let badConstructor = () => new AnalysisResult(badArray, testSimilarityScore, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined.");
        });

        it("Should throw an error if similarityScore is < 0", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], -1, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Bad Constructor: param 'similarityScore' must be <= 0.");
        });

        it("Should throw an error if matches[*][0] has an inconsistent submissionId.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore, subId1, subId2, filename1, filename2);
            subId3 = 'id3';
            expect(badConstructor).to.throw(Error, "Bad Constructor: all entries in param 'matches[*][0]' must have the same submissionId.");

        });

        it("Should throw an error if matches[*][1] has an inconsistent submissionId.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore, subId1, subId2, filename1, filename2);
            subId4 = 'id3';
            expect(badConstructor).to.throw(Error, "Bad Constructor: all entries in param 'matches[*][1]' must have the same submissionId.");

        });

        it("Should throw an error if matches[*][0] and matches[*][1] have the same submissionId.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, filename2);
            subId2 = 'id1';
            expect(badConstructor).to.throw(Error, "Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same submissionId.");
        });

        it("Should throw an error if matches[*][0] and matches[*][1] are the same AnalysisResultEntry object instance.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry1]], testSimilarityScore, subId1, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Bad Constructor: the two entries in a match at 'match[*]' must not be the same AnalysisResultEntry object instance.");
        });

        it("Should throw an error if submissionIdA is undefined.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, undefined, subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Provided submissionId values must not be undefined or empty strings")
        });

        it("Should throw an error if submissionIdA is an empty string.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, "", subId2, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Provided submissionId values must not be undefined or empty strings")
        });

        it("Should throw an error if submissionIdB is undefined.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, undefined, filename1, filename2);
            expect(badConstructor).to.throw(Error, "Provided submissionId values must not be undefined or empty strings")
        });

        it("Should throw an error if submissionIdB is an empty string.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, "", filename1, filename2);
            expect(badConstructor).to.throw(Error, "Provided submissionId values must not be undefined or empty strings")
        });

        it("Should throw an error if filenameA is undefined.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, undefined);
            expect(badConstructor).to.throw(Error, 'Provided filename values must not be undefined or empty strings');
        });

        it("Should throw an error if filenameA is an empty string.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, "");
            expect(badConstructor).to.throw(Error, 'Provided filename values must not be undefined or empty strings');
        });

        it("Should throw an error if filenameB is undefined.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, undefined);
            expect(badConstructor).to.throw(Error, 'Provided filename values must not be undefined or empty strings');
        });

        it("Should throw an error if filenameB is an empty string.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore, subId1, subId2, filename1, "");
            expect(badConstructor).to.throw(Error, 'Provided filename values must not be undefined or empty strings');
        });
    });

    describe("asJSON", () => {
        it("Should return a valid JSON object with the expected properties", () => {
            let are1 = new AnalysisResultEntry("are1", subId1, filename1, "method", 1, 3, 2, 4, "245rr1", "void test() { }");
            let are2 = new AnalysisResultEntry("are2", subId2, filename2, "method", 5, 7, 6, 8, "423qq1", "void similar() { }");
            let matches = [[are1, are2]];
            let files = new Map<string, string>().set(subId1, filename1).set(subId2, filename2)
            let matchesJSON = [[are1, are2]].map((match) => {return [match[0].asJSON(), match[1].asJSON()]})
            var expectedJSON = {'similarityScore': 5,
                                'files': [...files],
                                'matches': matchesJSON}
            var analysisResult = new AnalysisResult(matches, 5, subId1, subId2, filename1, filename2);
            expect(analysisResult.asJSON()).to.deep.equal(expectedJSON);
        });
    });

    describe("getSimilarityScore", () => {
        it("Should return expected value.", () => {
            expect(testAnalysisResult.getSimilarityScore()).to.be.equal(testSimilarityScore);
        });
    });

    describe("getMatches", () => {
        it("Should return expected array.", () => {
            expect(testAnalysisResult.getMatches()).to.be.deep.equal([[mockEntry1, mockEntry2]]);
        });
    });
});