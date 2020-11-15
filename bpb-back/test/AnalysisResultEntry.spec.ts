import chai from 'chai';
const expect = require('chai').expect;
import { isIterationStatement } from "typescript";
import { AnalysisResultEntry } from "../src/AnalysisResultEntry";

describe("AnalysisResultEntry",() => {
    var testARE : AnalysisResultEntry;

    before(() => {
        testARE = new AnalysisResultEntry("subid1", "/vagrant/bpb-back/uploads/test.java", "method", 
        1, 2, "245rr1", "void test() { }" );
    });
    
    describe("constructor", () => {
        it("Should throw an Error when lineNumberEnd < lineNumberStart", () => {
            let badConstructor = function(){new AnalysisResultEntry("subid1", "/vagrant/bpb-back/uploads/test.java", "method", 
            5, 2, "hash", "void test() { }")};
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
    
    describe("getText", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getText()).to.equal("void test() { }");
        }); 
    });
    
    describe("getFilePath", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getFilePath()).to.equal("/vagrant/bpb-back/uploads/test.java")
        });
    });
    
    describe("getContextType", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getContextType()).to.equal("method");
        });        
    });
    
    describe("asJSON",() => {
        it("Should return a valid JSON object with the expected properties",() => {
            var expected = '{"submissionId":"subid1","filePath":"/vagrant/bpb-back/uploads/test.java",\
            "contextType":"method","lineNumberStart":1,"lineNumberEnd":2,"hashValue":"245rr1","text":"void test() { }"}'
            var expectedJSON = JSON.parse(expected);
            expect(testARE.asJSON()).to.deep.equal(expectedJSON);
        });
    });

    describe("getHashValue", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getHashValue()).to.equal("245rr1");
        });
    });

});
