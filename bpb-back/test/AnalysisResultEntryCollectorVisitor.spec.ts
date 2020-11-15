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
        it("Should throw an error if no ParseTree has been visited.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor("someFilePath");
            expect(newVisitor.getAnalysisResultEntries()).to.throw(Error, "AnalysisResultEntryCollectorVisitor \
            has not visited a ParseTree");
        });

        it("Should NOT throw an error if a ParseTree has been visited.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor("someFilePath");
            newVisitor.visit(exampleTree);
            expect(newVisitor.getAnalysisResultEntries()).to.not.throw(Error);                      
        });
    });

    describe("getFilePath", () => {
        it("Should return a string with the expected value.", () => {
            let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath);
            expect(newVisitor.getFilePath()).is.equal('./res/javaExample.java');
        });
    })
});