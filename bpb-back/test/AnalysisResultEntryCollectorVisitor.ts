import { parse } from 'java-ast';
import { ParseTree } from 'antlr4ts/tree';
import { readFileSync } from 'fs';

describe("AnalysisResultEntryCollectorVisitor.ts", () => {
    var exampleTree : ParseTree;
    
    before(() => {
        let javaStr = readFileSync('./res/javaExample.java').toString();
        exampleTree = parse(javaStr);
    });
});