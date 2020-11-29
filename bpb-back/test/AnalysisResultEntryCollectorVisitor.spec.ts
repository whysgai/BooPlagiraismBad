import { parse } from 'java-ast';
import { ParseTree, RuleNode } from 'antlr4ts/tree';
import { readFileSync } from 'fs';
import { expect, assert } from 'chai';
var chai = require('chai')
import Sinon from 'sinon';
import { IAnalysisResultEntryCollectorVisitor, AnalysisResultEntryCollectorVisitor } from 
    '../src/model/AnalysisResultEntryCollectorVisitor';
var spies = require('chai-spies');
import { ISubmission, Submission } from '../src/model/Submission';
import { AnalysisResultEntry } from '../src/model/AnalysisResultEntry';

describe("AnalysisResultEntryCollectorVisitor.ts", () => {
    var exampleTree : ParseTree;
    var exampleFileName: string;
    var exampleSubmissionId = '8675309';
    var mockSubmission : ISubmission;

    before(() => {
        mockSubmission = Sinon.createStubInstance(Submission);
        chai.use(spies);
        chai.spy.on(mockSubmission, 'getId', () => exampleSubmissionId);
        exampleFileName = '/vagrant/bpb-back/test/res/javaExample.java'; // needs to be full path, so it can be parsed
        let javaStr = readFileSync(exampleFileName).toString();
        exampleTree = parse(javaStr);
    });

    describe("constructor()", () => {
        it('Should create visitor when provided a non-empty string for filePath parameter.', () => {
            let goodConstructor = function() { new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission)};
            expect(goodConstructor).to.not.throw(Error); 
        });

        it("Should throw an error if undefined is passed as the filePath parameter.", () => {
            let badConstructor = function() {new AnalysisResultEntryCollectorVisitor(undefined, mockSubmission)};
            expect(badConstructor).to.throw(Error, "file name must be non-empty and may not be undefined.");
        });

        it("Should throw an error if an empty string is passed as the filePath parameter.", () => {
            let badConstructor = function() {new AnalysisResultEntryCollectorVisitor("", mockSubmission)};
            expect(badConstructor).to.throw(Error, "file name must be non-empty and may not be undefined.");
        });
    });

    describe("getAnalysisResultEntries()", () => {
        var newVisitor : AnalysisResultEntryCollectorVisitor;

        beforeEach(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
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
            expect(newVisitor.getAnalysisResultEntries().length).to.equal(58);
        });
    });

    describe("getFileName()", () => {
        it("Should return a string with the expected value.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            expect(newVisitor.getFileName()).is.equal(exampleFileName);
        });
    });

    describe("getSubmission()", () => {
        it("Should return the expected Submission object.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            expect(newVisitor.getSubmission()).is.equal(mockSubmission);
        });
    });

    describe("hasVisited()", () => {
        var newVisitor : IAnalysisResultEntryCollectorVisitor;

        beforeEach(() => {
            newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
        });

        it("Should return FALSE when the visitor has NOT visited a parseTree.", () => {
            expect(newVisitor.hasVisited()).to.be.false;
        });

        it("Should return TRUE when the visitor has visited a parseTree.", () => {
            newVisitor.visit(exampleTree);
            expect(newVisitor.hasVisited()).to.be.true;
        })
    })

    describe("visit()", () => {
        var analysisResultEntries : AnalysisResultEntry[];
        var firstEntry : AnalysisResultEntry;

        before(() => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            newVisitor.visit(exampleTree);
            analysisResultEntries = newVisitor.getAnalysisResultEntries();
            firstEntry = analysisResultEntries[0];
        });

        it("Should throw an error if there is not enough variation in a subtree's text content", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = 'ERROR: not enough variation in input - ';
            chai.spy.on(newVisitor, 'createAnalysisResultEntry', () => {throw new Error(errorMsg);});
            let badVisitAttempt = () => newVisitor.visit(exampleTree);
            expect(badVisitAttempt).to.throw(Error, "Cannot perform a LocalitySensitiveHash upon the " +
            "root node of the subtree. The following error was thrown: " + errorMsg);
        });

        it("Should throw an error if a subtree's text content is too small", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = "ERROR: not enough variation in input - "
            chai.spy.on(newVisitor, 'createAnalysisResultEntry', () => {throw new Error(errorMsg);});
            let badVisitAttempt = () => newVisitor.visit(exampleTree);
            expect(badVisitAttempt).to.throw(Error, "Cannot perform a LocalitySensitiveHash upon the " +
            "root node of the subtree. The following error was thrown: " + errorMsg);
        });

        it("Should throw an error if an unexpected error is thrown by createAnalysisResultEntry", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = "some unexpected error"
            chai.spy.on(newVisitor, 'createAnalysisResultEntry', () => {throw new Error(errorMsg);});
            let badVisitAttempt = () => newVisitor.visit(exampleTree);
            expect(badVisitAttempt).to.throw(Error, errorMsg);
        });

        it("Should produce a list of entries which has the correct first entry (contextType is correct)", () => {
            expect(firstEntry.getContextType()).to.equal("compilationUnit");
        });

        it("Should produce a list of entries which has the correct first entry (hashValue is correct)", () => {
            let expectedHash = "9EB16BE3F7DA712B429867B30547B100DE94FF20827829F8C5DEAF49554819086B7F9D";
            expect(firstEntry.getHashValue()).to.equal(expectedHash);
        });

        it("Should produce a list of entries which has the correct first entry (lineNumberStart is correct)", () => {
            expect(firstEntry.getLineNumberStart()).to.equal(1);
        });

        it("Should produce a list of entries which has the correct first entry (lineNumberEnd is correct)", () => {
            expect(firstEntry.getLineNumberEnd()).to.equal(22);
        });

        it("Should produce a list of entries which has the correct first entry (charPosStart is correct)", () => {
            expect(firstEntry.getCharPosStart()).to.equal(0);
        });

        it("Should produce a list of entries which has the correct first entry (charPosEnd is correct)", () => {
            expect(firstEntry.getCharPosEnd()).to.equal(1);
        });    

        it("Should produce a list of entries which has the correct first entry (submissionId is correct)", () => {
            expect(firstEntry.getSubmissionID()).to.equal(exampleSubmissionId);
        });

        it("Should produce a list of entries which has the correct first entry (filename is correct)", () => {
            expect(firstEntry.getFileName()).to.equal(exampleFileName);
        });

        it("Should produce a list of entries which has the correct first entry (text is correct)", () => {
            expect(firstEntry.getText()).to.equal(readFileSync('/vagrant/bpb-back/test/res/AnalysisResultEntryCollector_VisitorVisitTestText.txt').toString());
        });
    });

    describe("visitChildren()", () => {

        it("Should throw an error if attempting to visit a child node throws an unanticipated error.", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = "some unexpected error";
            chai.spy.on(newVisitor, 'createAnalysisResultEntry', () => {throw new Error(errorMsg);});
            let exampleRuleNode = exampleTree as RuleNode;
            let badVisitAttempt = () => newVisitor.visitChildren(exampleRuleNode);
            expect(badVisitAttempt).to.throw(Error, errorMsg);
        });

        it("Should not throw an error if createAnalysisResultEntry throws an error because the string content is too short.", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = "ERROR: length too small -";
            chai.spy.on(newVisitor, 'createAnalysisResultEntry', () => {throw new Error(errorMsg);});
            let exampleRuleNode = exampleTree as RuleNode;
            let visitAttempt = () => newVisitor.visitChildren(exampleRuleNode);
            expect(visitAttempt).to.not.throw(Error);
        });

        it("Should not throw an error if createAnalysisResultEntry throws an error because the string content is too short.", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = "ERROR: not enough variation in input - ";
            chai.spy.on(newVisitor, 'createAnalysisResultEntry', () => {throw new Error(errorMsg);});
            let exampleRuleNode = exampleTree as RuleNode;
            let visitAttempt = () => newVisitor.visitChildren(exampleRuleNode);
            expect(visitAttempt).to.not.throw(Error);
        });

        it("Should break loop in function if shouldVisitNextChild returns false.", () => {
            var newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFileName, mockSubmission);
            let errorMsg = "ERROR: not enough variation in input - ";
            chai.spy.on(newVisitor, 'shouldVisitNextChild', () => false);
            let exampleRuleNode = exampleTree as RuleNode;
            let visitAttempt = () => newVisitor.visitChildren(exampleRuleNode);
            expect(visitAttempt).to.not.throw(Error);
        });
    });
});