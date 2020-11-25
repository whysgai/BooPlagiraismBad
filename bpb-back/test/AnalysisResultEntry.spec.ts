import chai from 'chai';
const expect = require('chai').expect;
import { AnalysisResultEntry } from "../src/model/AnalysisResultEntry";

describe("AnalysisResultEntry",() => {
    var testARE : AnalysisResultEntry;

    before(() => {
        testARE = new AnalysisResultEntry("are1","subid1", "test.java", "method", 
        1, 3, 2, 4, "245rr1", "void test() { }" );
    });
    
    describe("constructor", () => {
        it("Should throw an Error when lineNumberEnd < lineNumberStart", () => {
            let badConstructor = function(){new AnalysisResultEntry("are1","subid1", "test.java", "method", 
            5, 1, 2, 3, "hash", "void test() { }")};
            expect(badConstructor).to.throw(Error, 'lineNumberStart can not be > lineNumberEnd')
        });
    });

    describe("getSubmissionID", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getSubmissionID()).to.equal("subid1");
        });
    });

    describe("getLineNumberStart", () => {  
        it("Should return a number with the expected value.", () => {
            expect(testARE.getLineNumberStart()).to.equal(1);
        });
    });
    
    describe("getLineNumberEnd", () => {
        it("Should return a number with the expected value.", () => {
            expect(testARE.getLineNumberEnd()).to.equal(2);
        });    
    });

    describe("getCharPosStart", () => {
        it("Should return a number with the expected value.", () => {
            expect(testARE.getCharPosStart()).to.equal(3);
        });
    });
    
    describe("getCharPosEnd", () => {
        it("Should return a number with the expected value.", () => {
            expect(testARE.getCharPosEnd()).to.equal(4);
        });
    });

    describe("getText", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getText()).to.equal("void test() { }");
        }); 
    });
    
    describe("getFileName", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getFileName()).to.equal("test.java")
        });
    });
    
    describe("getContextType", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getContextType()).to.equal("method");
        });        
    });
    
    describe("asJSON",() => {
        it("Should return a valid JSON object with the expected properties",() => {
            var expected = '{"id":"are1","fileName":"test.java",\
            "contextType":"method","lineNumberStart":1, "charPosStart":3, "lineNumberEnd":2, "charPosEnd":4,\
            "hashValue":"245rr1"}'
            var expectedJSON = JSON.parse(expected);
            expect(testARE.asJSON()).to.deep.equal(expectedJSON);
        });
    });

    describe("getHashValue", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getHashValue()).to.equal("245rr1");
        });
    });

    describe("getStaticModel",() => {
        it("Should return a non-undefined static model",() => {
            expect(AnalysisResultEntry.getStaticModel()).to.not.be.undefined;
        });
    });

    describe("getModelInstance",() => {
        it("Should return a non-undefined model instance",() => {
            expect(testARE.getModelInstance()).to.not.be.undefined;
        });
    });
});