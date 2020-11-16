import {AnalysisResultEntry} from "./AnalysisResultEntry";
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
export interface IAnalysisResultEntryCollectorVisitor {
    getAnalysisResultEntries(): AnalysisResultEntry[]    
}

//TODO: Add extension of AbstractParseTreeVisitor (including actual visit methods, etc)
export class AnalysisResultEntryCollectorVisitor extends AbstractParseTreeVisitor<any> implements IAnalysisResultEntryCollectorVisitor  {
    
    protected defaultResult() {
        throw new Error("Method not implemented.");
    }
    
    private filePath : String;

    constructor(filePath : String) {
        super();
        this.filePath = filePath;
    }

    getAnalysisResultEntries() : AnalysisResultEntry[] {
        return [] //TODO
    }
}