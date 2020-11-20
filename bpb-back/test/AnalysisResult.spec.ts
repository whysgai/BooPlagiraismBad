import { expect } from "chai";
var chai = require('chai');
var spies = require('chai-spies');
import Sinon from "sinon";
import { AnalysisResult, IAnalysisResult } from "../src/model/AnalysisResult";
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";

describe.only("AnalysisResult.ts",() => {
    var mockEntry1 : IAnalysisResultEntry;
    var mockEntry2 : IAnalysisResultEntry;
    var mockEntry3 : IAnalysisResultEntry;
    var mockEntry4 : IAnalysisResultEntry;
    var testSimilarityScore : number;
    var testAnalysisResult : IAnalysisResult;


    before(() => {
        chai.use(spies);

        mockEntry1 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry2 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry3 = Sinon.createStubInstance(AnalysisResultEntry);
        mockEntry4 = Sinon.createStubInstance(AnalysisResultEntry);

        testSimilarityScore = 5;
        testAnalysisResult = new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
    });

    beforeEach(() => {
        //TODO: fix chai spies assignment/ re-setting mock output.
        chai.spy.on(mockEntry1, 'getFilePath', () => 'filePath1');
        chai.spy.on(mockEntry2, 'getFilePath', () => 'filePath2');
        chai.spy.on(mockEntry3, 'getFilePath', () => 'filePath1');
        chai.spy.on(mockEntry4, 'getFilePath', () => 'filePath2');
        chai.spy.on(mockEntry1, 'getSubmissionID', () => 'id1');
        chai.spy.on(mockEntry2, 'getSubmissionID', () => 'id2');
        chai.spy.on(mockEntry3, 'getSubmissionID', () => 'id1');
        chai.spy.on(mockEntry4, 'getSubmissionID', () => 'id2');
    });
        
    describe("Constructor tests", () => {

        it("Should successfuly construct.", () => {
            let goodConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
            expect(goodConstructor).to.not.throw(Error);
        });

        it("Should throw an error if an empty array is provided, and similarityScore is not 0", () => {
            let emptyArray = new Array<Array<IAnalysisResultEntry>>();
            let badConstructor = () => new AnalysisResult(emptyArray, 5);
            expect(badConstructor).to.throw(Error("Bad Constructor: if no matches are provided, param 'similarityScore' should be 0."));            
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
            expect(badConstructor).to.throw(Error("Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined."));
        });

        it("Should throw an error if matches[*][1] is undefined.", () => {
            let badArray = new Array<Array<IAnalysisResultEntry>>();
            badArray.push([mockEntry1, undefined]);
            let badConstructor = () => new AnalysisResult(badArray, testSimilarityScore);
            expect(badConstructor).to.throw(Error("Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined."));
        });

        it("Should throw an error if similarityScore is < 0", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], -1);
            expect(badConstructor).to.throw(Error("Bad Constructor: param 'similarityScore' must be <= 0."));
        });

        it("Should throw an error if matches[*][0] has an inconsistent filepath.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore);
            chai.spy.on(mockEntry3, 'getFilePath', () => 'filePath3');
            expect(badConstructor).to.throw(Error("Bad Constructor: all entries in param 'matches[*][0]' must have the same filepath."));
        });

        it("Should throw an error if matches[*][1] has an inconsistent filepath.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore);
            chai.spy.on(mockEntry4, 'getFilePath', () => 'filePath3');
            expect(badConstructor).to.throw(Error("Bad Constructor: all entries in param 'matches[*][1]' must have the same filepath."));
        });
        
        it("Should throw an error if matches[*][0] and matches[*][1] have the same filepath.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
            chai.spy.on(mockEntry2, 'getFilePath', () => 'filePath1');
            expect(badConstructor).to.throw(Error("Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same filepath."));
        });

        it("Should throw an error if matches[*][0] has an inconsistent submissionId.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore);
            chai.spy.on(mockEntry3, 'getSubmissionID', () => 'id3');
            expect(badConstructor).to.throw(Error("Bad Constructor: all entries in param 'matches[*][0]' must have the same submissionId."));
        });

        it("Should throw an error if matches[*][1] has an inconsistent submissionId.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2], [mockEntry3, mockEntry4]], testSimilarityScore);
            chai.spy.on(mockEntry4, 'getSubmissionID', () => 'id3');
            expect(badConstructor).to.throw(Error("Bad Constructor: all entries in param 'matches[*][1]' must have the same submissionId."));
        });

        it("Should throw an error if matches[*][0] and matches[*][1] have the same submissionId.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry2]], testSimilarityScore);
            chai.spy.on(mockEntry2, 'getSubmissionID', () => 'id1');
            expect(badConstructor).to.throw(Error("Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same submissionId."));
        });

        it("Should throw an error if matches[*][0] and matches[*][1] are the same AnalysisResultEntry object instance.", () => {
            let badConstructor = () => new AnalysisResult([[mockEntry1, mockEntry1]], testSimilarityScore);
            expect(badConstructor).to.throw(Error("Bad Constructor: the two entries in a match at 'match[*]' must not be the same AnalysisResultEntry object instance."))
        });
    });

    const newLocal = describe("asJSON", () => {
        it("Should return a valid JSON object with the expected properties", () => {
            //TODO: Expected property changes may make this test fail!
            var expected = '[[{"sub_id":"subid1","file_path":"/test/file.java","context":"method","start":1,"end":2,"hash":"245rr1","text":"void test() { }"},{"sub_id":"subid2","file_path":"/test/file2.java","context":"method","start":5,"end":6,"hash":"423qq1","text":"void similar() { }"}]]';
            var expectedJSON = JSON.parse(expected);
            let matches = [[new AnalysisResultEntry("are1", "subid1", "/test/file.java", "method", 1, 3, 2, 4, "245rr1", "void test() { }"),
                        new AnalysisResultEntry("are2", "subid2", "test/file2.java", "method", 5, 7, 6, 8, "423qq1", "void similar() { }")]]
            var analysisResult = new AnalysisResult(matches, 5);
            expect(analysisResult.asJSON).to.equal(expectedJSON);
        });
    });

    describe("getSimilarityScore", () => {

        it("Should return expected value.", () => {
            expect(testAnalysisResult.getSimilarityScore()).to.be.equal(testSimilarityScore);
        });
    });

    describe("getMatches", () => {
        it("Should return expected array.", () => {
            expect(testAnalysisResult.getMatches()).to.have.ordered.members([[mockEntry1, mockEntry2]]);
        });
    });
});