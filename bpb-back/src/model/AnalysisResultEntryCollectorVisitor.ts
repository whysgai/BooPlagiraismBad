import {AnalysisResultEntry} from "../AnalysisResultEntry";
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParseTreeVisitor, RuleNode } from "antlr4ts/tree";
import { ISubmission } from "./Submission";
import { JavaParser } from 'java-ast/dist/parser/JavaParser'

export interface IAnalysisResultEntryCollectorVisitor extends ParseTreeVisitor<any> {
    getAnalysisResultEntries(): AnalysisResultEntry[];
    getFilePath() : string;
    getSubmission() : ISubmission;
    hasVisited() : boolean;
}

//TODO: change <any> to appropriate type
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

    getSubmission(): ISubmission {
        return this.submission;
    }

    hasVisited(): boolean {
        return this.visited;
    }

    getFilePath(): string {
        return this.filePath;
    }

    protected getLSHValue(textContent : string) : string {
        let tlsh = new Tlsh();
        tlsh.update(textContent, textContent.length+1);
        tlsh.finale();
        return tlsh.hash().toString();
    }
    
    protected createAnalysisResultEntry(parseTree : ParseTree) : AnalysisResultEntry {
        
        let hashValue = this.getLSHValue(parseTree.toStringTree());
        let submissionId = this.submission.getId();
        let contextType;
        let textContent;
        let lineStart;
        let lineStop;
        if(parseTree instanceof ParserRuleContext) {
        //Cast ParseTree to ParserRuleContext to access _start and _stop tokens
            let asParserRuleContext = parseTree as ParserRuleContext;
            textContent = asParserRuleContext.text;
            contextType = JavaParser.ruleNames[asParserRuleContext.ruleContext.ruleIndex];
            lineStart = asParserRuleContext._start.line;
            lineStop = asParserRuleContext._stop.line;
        }
        return new AnalysisResultEntry(submissionId, this.filePath, contextType, lineStart, lineStop, hashValue, textContent);
    }

    visit(parseTree : ParseTree) {
        try {
            this.analysisResultEntries.push(this.createAnalysisResultEntry(parseTree)); //Collect our AnalysisResultEntry for the root node
        } catch (err) {
        /**If the length of node.text is < 50 chars, or if node.text is lacking a certain ammount 
             * of variation, then tlsh.hash() will throw an error. If one of these errors are thrown, 
             * we will skip this node, as its content is not viable for us to perform a 
             * LocalitySensitiveHash upon, using the trendmicro/tlsh library.
            */
            if (err.message.includes("ERROR: length too small -") || 
            err.message.includes("ERROR: not enought variation in input - ")) {
                throw new Error("Cannot perform a LocalitySensitiveHash upon the" +
                "root node of the subtree. The following error was thrown: " + err.message);
            } else {
                throw err;
            }
        }
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
            
            try {
                //Collect our AnalysisResultEntry for the child node
                this.analysisResultEntries.push(this.createAnalysisResultEntry(c)); 
                let childResult = c.accept(this); //If an error is caught, no further nodes in this subtree will be visited.
                result = this.aggregateResult(result, childResult);
            } catch (err) {
                /**If the length of node.text is < 50 chars, or if node.text is lacking a certain ammount 
                 * of variation, then tlsh.hash() will throw an error. If one of these errors are thrown, 
                 * we will skip this node, as its content is not viable for us to perform a 
                 * LocalitySensitiveHash upon, using the trendmicro/tlsh library.
                */
                if (err.message.includes("ERROR: length too small -") || 
                err.message.includes("ERROR: not enought variation in input - ")) {
                    //Skip this node
                } else {
                    throw err;
                }
            }
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