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
        it('Should create visitor when provided a filepath string.', () => {
            try {
                let newVisitor = new AnalysisResultEntryCollectorVisitor(exampleFilePath);
                assert(true == true);
            } catch {
                assert.fail()
            }
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

    // describe("")
});