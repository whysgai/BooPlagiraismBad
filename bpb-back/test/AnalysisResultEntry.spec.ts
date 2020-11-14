import { expect } from "chai";
import { isIterationStatement } from "typescript";
import { AnalysisResultEntry } from "../src/AnalysisResultEntry";

describe.skip("AnalysisResultEntry",() => {
    var testARE : AnalysisResultEntry;

    before(() => {
        testARE = new AnalysisResultEntry("subid1", "/vagrant/bpb-back/uploads/test.java", "method", 
        1, 2, "hash", "void test() { }" );
    });
    
    describe("constructor", () => {
        it("Should throw an Error when lineNumberEnd < lineNumberStart", () => {
            expect(new AnalysisResultEntry("subid1", "/vagrant/bpb-back/uploads/test.java", "method", 
            5, 2, "hash", "void test() { }")).throw(Error);
        });
    });

    describe("getLineNumberStart", () => {  
        it("Should return a number with the expected value.", () => {
            expect(testARE.getLineNumberStart()).to.be.an.instanceOf(Number);
            expect(testARE.getLineNumberStart()).to.equal(1);
        });
    });
    
    describe("getLineNumberEnd", () => {
        it("Should return a number with the expected value.", () => {
            expect(testARE.getLineNumberEnd()).to.be.an.instanceOf(Number);
            expect(testARE.getLineNumberEnd()).to.equal(2);
        });    
    });
    
    describe("getText", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getText()).to.be.an.instanceOf(String);
            expect(testARE.getText()).to.equal("void test() { }");
        }); 
    });
    
    describe("getFilePath", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getFilePath()).to.be.an.instanceof(String);
            expect(testARE.getFilePath()).to.equal("/vagrant/bpb-back/uploads/test.java")
        });
    });
    
    describe("getContextType", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getContextType()).to.be.an.instanceof(String);
            expect(testARE.getContextType()).to.equal("method");
        });        
    });
    
    describe("asJSON",() => {
        it("Should return a valid JSON object with the expected properties",() => {
            var expected = '{"sub_id":"subid1","file_path":"/vagrant/bpb-back/uploads/test.java",\
            "context":"method","start":1,"end":2,"hash":"245rr1","text":"void test() { }"}'
            var expectedJSON = JSON.parse(expected);
            // var analysisResultEntry = new AnalysisResultEntry("subid1","/vagrant/bpb-back/uploads/test.java","method",1,2,"245rr1","void test() { }");
            expect(testARE.asJSON()).to.be.an.instanceof(JSON);
            expect(testARE.asJSON()).to.equal(expectedJSON);
        });
    });

    describe("getHashValue", () => {
        it("Should return a string with the expected value.", () => {
            expect(testARE.getHashValue()).to.be.an.instanceof(String);
            expect(testARE.getHashValue()).to.equal("hash");
        });
    });

});
