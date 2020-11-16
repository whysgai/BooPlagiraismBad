import {AnalysisResultEntry} from "./AnalysisResultEntry";
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
interface IAnalysisResultEntryCollectorVisitor {
    getAnalysisResultEntries(): AnalysisResultEntry[]    
}

//TODO: Add extension of AbstractParseTreeVisitor (including actual visit methods, etc)
class AnalysisResultEntryCollectorVisitor extends AbstractParseTreeVisitor<any> implements IAnalysisResultEntryCollectorVisitor  {
    protected defaultResult() {
        throw new Error("Method not implemented.");
    }
    
    constructor(filePath : String) {
        super();
        //TODO: filePath is the path to the file being processed. Don't need to retrieve contents again (done externally) - this is for inclusion in AnalysisResultEntry metadata
    }
    getAnalysisResultEntries() : AnalysisResultEntry[] {
        return [] //TODO
    }
}