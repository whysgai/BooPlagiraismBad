import { parse } from 'java-ast';
import { ParseTree } from 'antlr4ts/tree';
import { readFileSync } from 'fs';
import { expect, assert } from 'chai';
var chai = require('chai')
import Sinon from 'sinon';
import { IAnalysisResultEntryCollectorVisitor, AnalysisResultEntryCollectorVisitor } from 
    '../src/model/AnalysisResultEntryCollectorVisitor';
var spies = require('chai-spies');
import { ISubmission, Submission } from '../src/model/Submission';
import { AnalysisResultEntry } from '../src/AnalysisResultEntry';

describe("AnalysisResultEntryCollectorVisitor.ts", () => {
    var exampleTree : ParseTree;
    var exampleFilePath : string;
    var exampleSubmissionId = '8675309';
    var mockSubmission : ISubmission;

    before(() => {
        mockSubmission = Sinon.createStubInstance(Submission);
        chai.use(spies);
        chai.spy.on(mockSubmission, 'getId', () => exampleSubmissionId);
        exampleFilePath = '/vagrant/bpb-back/test/res/javaExample.java';
        let javaStr = readFileSync(exampleFilePath).toString();
        exampleTree = parse(javaStr);
    });

    describe("Constructor Tests", () => {
        it('Should create visitor when provided a non-empty string for filePath parameter.', () => {
            try {
                let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath, mockSubmission);
                assert(true == true);
            } catch { assert.fail() }
        });

        it("Should throw an error if undefined is passed as the filePath parameter.", () => {
            let badConstructor = function() {new AnalysisResultEntryCollectorVisitor(undefined, mockSubmission)};
            expect(badConstructor).to.throw(Error, "filePath must be non-empty and may not be undefined.");
        });

        it("Should throw an error if an empty string is passed as the filePath parameter.", () => {
            let badConstructor = function() {new AnalysisResultEntryCollectorVisitor("", mockSubmission)};
            expect(badConstructor).to.throw(Error, "filePath must be non-empty and may not be undefined.");
        });
    });

    describe("getAnalysisResultEntries", () => {
        var newVisitor : AnalysisResultEntryCollectorVisitor;

        beforeEach(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath, mockSubmission);
        });

        it("Should throw an error if no ParseTree has been visited.", () => { 
            let functionCall = function() { newVisitor.getAnalysisResultEntries(); };
            expect(functionCall).to.throw(Error, "Visitor has not visited a ParseTree");
        });

        it("Should NOT throw an error if a ParseTree has been visited.", () => {
            newVisitor.visit(exampleTree);
            let functionCall = function() { newVisitor.getAnalysisResultEntries(); };
            expect(functionCall).to.not.throw(Error);                      
        });

        it("Should return an AnalysisResultEntry[] of expected length.", () => {
            newVisitor.visit(exampleTree);
            expect(newVisitor.getAnalysisResultEntries().length).to.equal(233);
        });
    });

    describe("getFilePath", () => {
        it("Should return a string with the expected value.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath, mockSubmission);
            expect(newVisitor.getFilePath()).is.equal(exampleFilePath);
        });
    });

    describe("getSubmission", () => {
        it("Should return the expected Submission object.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath, mockSubmission);
            expect(newVisitor.getSubmission()).is.equal(mockSubmission);
        });
    });

    describe("hasVisited", () => {
        var newVisitor : IAnalysisResultEntryCollectorVisitor;

        beforeEach(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath, mockSubmission);
        });

        it("Should return FALSE when the visitor has NOT visited a parseTree.", () => {
            expect(newVisitor.hasVisited()).to.be.false;
        });

        it("Should return TRUE when the visitor has visited a parseTree.", () => {
            newVisitor.visit(exampleTree);
            expect(newVisitor.hasVisited()).to.be.true;
        })
    })

    describe("visit (checks resultant array and contents for validity)", () => {
        var newVisitor : AnalysisResultEntryCollectorVisitor;
        var analysisResultEntries : AnalysisResultEntry[];
        var firstEntry = analysisResultEntries[0];
        
        before(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath, mockSubmission);
            newVisitor.visit(exampleTree);
            analysisResultEntries = newVisitor.getAnalysisResultEntries();
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.contextType Should match as expected.", () => {
            expect(firstEntry.getContextType()).to.equal("placeholderText");
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.hashValue Should match as expected.", () => {
            let expectedHash = "9EB16BE3F7DA712B429867B30547B100DE94FF20827829F8C5DEAF49554819086B7F9D";
            expect(firstEntry.getHashValue()).to.equal(expectedHash);
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.lineNumberStart Should match as expected.", () => {
            expect(firstEntry.getLineNumberStart()).to.equal(1);
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.lineNumberEnd Should match as expected.", () => {
            expect(firstEntry.getLineNumberEnd()).to.equal(22);
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.submissionId Should match as expected.", () => {
            expect(firstEntry.getSubmissionID()).to.equal(exampleSubmissionId);
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.filePath Should match as expected.", () => {
            expect(firstEntry.getFilePath()).to.equal(exampleFilePath);
        });

        it("First entry in resultant AnalysisResultArray[] Should correspond to the root of the given ParseTree," +
        "and firstEntry.text Should match as expected.", () => {
            expect(firstEntry.getText()).to.equal(readFileSync('/vagrant/bpb-back/test/res/AnalysisResultEntryCollector_VisitorVisitTestText.txt').toString());
        });
        
    });
});