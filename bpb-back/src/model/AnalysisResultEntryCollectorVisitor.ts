import {AnalysisResultEntry} from "../AnalysisResultEntry";
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { RuleNode } from "antlr4ts/tree";
import { ISubmission } from "./Submission";

export interface IAnalysisResultEntryCollectorVisitor {
    getAnalysisResultEntries(): AnalysisResultEntry[];
    getFilePath() : string;    
}

export class AnalysisResultEntryCollectorVisitor extends AbstractParseTreeVisitor<any> implements IAnalysisResultEntryCollectorVisitor  {
    private analysisResultEntries : AnalysisResultEntry[];
    private visited : boolean;

    protected defaultResult() {
        return this.analysisResultEntries;
    }
    
    constructor(private filePath : string, private submission : ISubmission) {
        super();
        this.visited = false;
        if(filePath == undefined || filePath == "") {
            throw new Error("filePath must be non-empty and may not be undefined.")
        }
        this.analysisResultEntries = new Array<AnalysisResultEntry>();
    }

    hasVisited(): boolean {
        return this.visited;
    }

    getFilePath(): string {
        return this.filePath;
    }

    protected getLSHValue(textContent : string) : string {
        // let tlsh = new Tlsh();
        // tlsh.update(textContent, textContent.length+1);
        // tlsh.finale();
        // return tlsh.hash().toString();
        return "hash"
    }
    
    protected createAnalysisResultEntry(parseTree : ParseTree) : AnalysisResultEntry {
        
        let submissionId = this.submission.getId();
        //TODO: figure out how to get contextType
        let contextType = parseTree.text;
        let textContent = parseTree.toStringTree();
        //TODO: figure out whats wrong with the hash() function [hard coded 'hash' for now for execution]
        let hashValue = this.getLSHValue(textContent);
        let lineStart;
        let lineStop;
        if(parseTree instanceof ParserRuleContext) {
        //Cast ParseTree to ParserRuleContext to access _start and _stop tokens
            var asParserRuleContext = parseTree as ParserRuleContext;
            lineStart = asParserRuleContext._start.line;
            lineStop = asParserRuleContext._stop.line;
        }
        return new AnalysisResultEntry(submissionId, this.filePath, contextType, lineStart, lineStop, hashValue, textContent);
    }

    visit(parseTree : ParseTree) {
        this.analysisResultEntries.push(this.createAnalysisResultEntry(parseTree)); //Collect our AnalysisResultEntry for the root node
        let returnVal : any = parseTree.accept(this); 
        this.visited = true; //Confirms that this visitor has performed a visit. See getAnalysisResultEntries()
        return returnVal;
    }

    visitChildren(node : RuleNode) {
        let result = this.defaultResult();
        let n = node.childCount;
        for (let i = 0; i < n; i++) {
            if (!this.shouldVisitNextChild(node, result)) {
                break;
            }
            let c = node.getChild(i);
            
            //Collect our AnalysisResultEntry for the child node
            this.analysisResultEntries.push(this.createAnalysisResultEntry(c)); 
            
            let childResult = c.accept(this);
            result = this.aggregateResult(result, childResult);
        }
        return result;
    }

    getAnalysisResultEntries() : AnalysisResultEntry[] {
        if (this.hasVisited()) {
            return this.analysisResultEntries;
        } else {
            throw new Error("Visitor has not visited a ParseTree");
        }
    }
}