import { assert, expect } from "chai";
var chai = require('chai');
var spies = require('chai-spies');
import Sinon from "sinon";
import { AnalysisResult, IAnalysisResult } from "../src/model/AnalysisResult";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";

describe("AnalysisResult.ts", () => {
    var mockEntry1 : IAnalysisResultEntry;
    var mockEntry2 : IAnalysisResultEntry;
    var mockEntry3 : IAnalysisResultEntry;
    var mockEntry4 : IAnalysisResultEntry;
    
    //Used in our spy-ed functions
    var filePath1 : string;
    var subId1 : string;
    var filePath2 : string;
    var subId2 : string;
    var filePath3 : string;
    var subId3 : string;
    var filePath4 : string;
    var subId4 : string;
    
    var testSimilarityScore : number;
    var testAnalysisResult : IAnalysisResult;


    before(() => {
        chai.use(spies);

        mockEntry1 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry2 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry3 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry4 = Sinon.createStubInstance(AnalysisResultEntry);

        chai.spy.on(mockEntry1, 'getFilePath', () => filePath1);
        chai.spy.on(mockEntry1, 'getSubmissionID', () => subId1);
        chai.spy.on(mockEntry2, 'getFilePath', () => filePath2);
        chai.spy.on(mockEntry2, 'getSubmissionID', () => subId2);
        chai.spy.on(mockEntry3, 'getFilePath', () => filePath3);
        chai.spy.on(mockEntry3, 'getSubmissionID', () => subId3);
        chai.spy.on(mockEntry4, 'getFilePath', () => filePath4);
        chai.spy.on(mockEntry4, 'getSubmissionID', () => subId4);
        
        testSimilarityScore = 5;

        //Set these so our testAnalysisResult passes construction
        filePath1 = 'testPath1';
        subId1 = 'testID1';
        filePath2 = 'testPath2';
        subId2 = 'testID2'

        testAnalysisResult = new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
    });

    
    describe("Constructor tests", async () => {

        beforeEach( async () => {
            filePath1 = 'path1';
            subId1 = 'id1';
            filePath2 = 'path2';
            subId2 = 'id2';
        });

        afterEach(() => {
            filePath1 = 'path1';
            subId1 = 'id1';
            filePath2 = 'path2';
            subId2 = 'id2';
            filePath3 = 'path1';
            subId3 = 'id1';
            filePath4 = 'path2';
            subId4 = 'id2';
        })
        
        it("Should successfuly construct.", () => {
            let goodConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
            expect(goodConstructor).to.not.throw(Error);
        });

        it("Should throw an error if an empty array is provided, and similarityScore is not 0", () => {
            let emptyArray = new Array<Array<IAnalysisResultEntry>>();
            let badConstructor = () => new AnalysisResult(emptyArray, 5);
            expect(badConstructor).to.throw(Error, "Bad Constructor: if no matches are provided, param 'similarityScore' should be 0.");
        });

        it("Should NOT throw an error if an empty array is provided, and similarityScore is 0", () => {
            let emptyArray = new Array<Array<IAnalysisResultEntry>>();
            let badConstructor = () => new AnalysisResult(emptyArray, 0);
            expect(badConstructor).to.not.throw(Error);            
        });

        it("Should throw an error if matches[*][0] is undefined.", () => {
            let badArray = new Array<Array<IAnalysisResultEntry>>();
            badArray.push([undefined, mockEntry2]);
            let badConstructor = () => new AnalysisResult(badArray, testSimilarityScore);
            expect(badConstructor).to.throw(Error, "Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined.");
        });

        it("Should throw an error if matches[*][1] is undefined.", () => {
            let badArray = new Array<Array<IAnalysisResultEntry>>();
            badArray.push([mockEntry1, undefined]);
            let badConstructor = () => new AnalysisResult(badArray, testSimilarityScore);
            expect(badConstructor).to.throw(Error, "Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined.");
        });

        it("Should throw an error if similarityScore is < 0", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], -1);
            expect(badConstructor).to.throw(Error, "Bad Constructor: param 'similarityScore' must be <= 0.");
        });
        
        it("Should throw an error if matches[*][0] and matches[*][1] have the same filepath.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
            filePath2 = 'path1';
            expect(badConstructor).to.throw(Error, "Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same filepath.");

        });

        it("Should throw an error if matches[*][0] has an inconsistent submissionId.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore);
            subId3 = 'id3';
            expect(badConstructor).to.throw(Error, "Bad Constructor: all entries in param 'matches[*][0]' must have the same submissionId.");

        });

        it("Should throw an error if matches[*][1] has an inconsistent submissionId.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore);
            subId4 = 'id3';
            expect(badConstructor).to.throw(Error, "Bad Constructor: all entries in param 'matches[*][1]' must have the same submissionId.");

        });

        it("Should throw an error if matches[*][0] and matches[*][1] have the same submissionId.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
            subId2 = 'id1';
            expect(badConstructor).to.throw(Error, "Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same submissionId.");
        });

        it("Should throw an error if matches[*][0] and matches[*][1] are the same AnalysisResultEntry object instance.", async () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry1]], testSimilarityScore);
            expect(badConstructor).to.throw(Error, "Bad Constructor: the two entries in a match at 'match[*]' must not be the same AnalysisResultEntry object instance.");
        });
    });

    describe("asJSON", () => {
        it("Should return a valid JSON object with the expected properties", () => {
            //TODO: Expected property changes may make this test fail!
            let are1 = new AnalysisResultEntry("are1", "subid1", "/test/file.java", "method", 1, 3, 2, 4, "245rr1", "void test() { }");
            let are2 = new AnalysisResultEntry("are2", "subid2", "test/file2.java", "method", 5, 7, 6, 8, "423qq1", "void similar() { }");
            let matches = [[are1, are2]]
            var expectedJSON = {'similarityScore': 5,
                                'matches': matches.map((match) => {return [match[0].asJSON(), match[1].asJSON()]})} //ARE.asJSON should be tested on its own level, so safe to use here to prevent test break-age down the line
            var analysisResult = new AnalysisResult(matches, 5);
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