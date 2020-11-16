import { parse } from 'java-ast';
import { ParseTree } from 'antlr4ts/tree';
import { readFileSync } from 'fs';
import { IAnalysisResultEntryCollectorVisitor, AnalysisResultEntryCollectorVisitor } from 
    '../src/model/AnalysisResultEntryCollectorVisitor';
import { expect, assert } from 'chai';

describe("AnalysisResultEntryCollectorVisitor.ts", () => {
    var exampleTree : ParseTree;
    var exampleFilePath : string;

    before(() => {
        exampleFilePath = './res/javaExample.java';
        // let javaStr = readFileSync(exampleFilePath).toString();
        // exampleTree = parse(javaStr);
    });

    describe("Constructor Tests", () => {
        it('Should create visitor when provided a non-empty string for filePath parameter.', () => {
            try {
                let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath);
                assert(true == true);
            } catch { assert.fail() }
        });

        it("Should throw an error if undefined is passed as the filePath parameter.", () => {
            let badConstructor = function() {new AnalysisResultEntryCollectorVisitor(undefined)};
            expect(badConstructor).to.throw(Error, "filePath must be non-empty and may not be undefined.");
        });

        it("Should throw an error if an empty string is passed as the filePath parameter.", () => {
            let badConstructor = function() {new AnalysisResultEntryCollectorVisitor("")};
            expect(badConstructor).to.throw(Error, "filePath must be non-empty and may not be undefined.");
        });
    });

    describe("getAnalysisResultEntries", () => {
        var newVisitor : AnalysisResultEntryCollectorVisitor;

        beforeEach(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath);
        });

        it("Should throw an error if no ParseTree has been visited.", () => { 
            let functionCall = function() { newVisitor.getAnalysisResultEntries(); };
            expect(functionCall).to.throw(Error, "Visitor has not visited a ParseTree");
        });

        it("Should NOT throw an error if a ParseTree has been visited.", () => {
            newVisitor.visit(exampleTree);
            expect(newVisitor.getAnalysisResultEntries()).to.not.throw(Error);                      
        });

        it("Should return an AnalysisResultEntry[] of expected length.", () => {
            newVisitor.visit(exampleTree);
            expect(newVisitor.getAnalysisResultEntries().length).to.equal("placeholderText");
        });
    });

    describe("getFilePath", () => {
        it("Should return a string with the expected value.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath);
            expect(newVisitor.getFilePath()).is.equal(exampleFilePath);
        });
    });

    describe("visit", () => {
        var newVisitor : AnalysisResultEntryCollectorVisitor;
        before(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath);
            newVisitor.visit(exampleTree);
        });
        
        it("Should throw an Error if visitor tries to visit after it already has.", () => {
            let visitCall = function() { newVisitor.visit(exampleTree); };
            expect(visitCall).to.throw(Error, "Visitor has already visited a ParseTree.");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.contextType Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getContextType()).to.equal("placeholderText");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.hashValue Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getHashValue()).to.equal("placeholderText");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.lineNumberStart Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getLineNumberStart()).to.equal("placeholderText");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.lineNumberEnd Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getLineNumberEnd()).to.equal("placeholderText");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.submissionId Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getSubmissionID()).to.equal("FAIL IF ID IS NOT YET IMPLEMENTED IN CLASS");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.filePath Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getFilePath()).to.equal(exampleFilePath);
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.text Should match as expected.", () => {
            newVisitor.visit(exampleTree);
            let analysisResultEntries = newVisitor.getAnalysisResultEntries();
            let firstEntry = analysisResultEntries[0];
            expect(firstEntry.getText()).to.equal("placeholderText");
        });
        
    });
});