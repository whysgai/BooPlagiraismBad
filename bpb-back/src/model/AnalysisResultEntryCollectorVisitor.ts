//AnalysisResultEntryCollectorVisitor.ts
/**
 * Contains {@link IAnalysisResultEntryCollectorVisitor } and {@link @AnalysisResultEntryCollectorVisitor}
 * @packageDocumentation
 */
import {AnalysisResultEntry} from "./AnalysisResultEntry";
import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { Tlsh } from '../lib/tlsh';
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParseTreeVisitor, RuleNode } from "antlr4ts/tree";
import { ISubmission } from "./Submission";
import { JavaParser } from 'java-ast/dist/parser/JavaParser'

/**
 * Interface for an AnalysisResultEntryCollectorVisitor. Extends the {@link ParseTreeVisitor interface}
 */
export interface IAnalysisResultEntryCollectorVisitor extends ParseTreeVisitor<any> {
    /**
     * returns the AnalysisResultEntry[] gathered by the visitor.
     */
    getAnalysisResultEntries(): AnalysisResultEntry[];
    
    /**
     * Returns the filePath of the file whose AST the visitor is visiting.
     */
    getFilePath() : string;
    
    /**
     * returns the ISubmission implementing object that this visitor is working on the behalf of.
     */
    getSubmission() : ISubmission;
    
    /**
     * returns True if the {@link IAnalysisResultEntryCollectorVisitor} has performed a visit(). 
     * Returns False otherwise.
     */
    hasVisited() : boolean;
}

//TODO: change <any> to appropriate type
/**
 * Implementation of the {@link IAnalysisResultEntryCollectorVisitor} interface. Extends {@link AbstractParseTreeVisitor} 
 * to visit a given {@link ParseTree}, and creates an array of {@link AnalysisResultEntry | analysisResultEntries} of 
 * relevant nodes while visiting.
 */
export class AnalysisResultEntryCollectorVisitor extends AbstractParseTreeVisitor<any> implements IAnalysisResultEntryCollectorVisitor  {
    private analysisResultEntries : AnalysisResultEntry[];
    private visited : boolean;

    /**
     * See {@inheritdoc}
     */
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

    /**
     * returns this.submission
     */
    getSubmission(): ISubmission {
        return this.submission;
    }

    /**
     * returns this.visited
     */
    hasVisited(): boolean {
        return this.visited;
    }

    /**
     * returns this.filePath
     */
    getFilePath(): string {
        return this.filePath;
    }

    /**
     * Given a string 'textcontent', creates a hash value using Locality Sensitive Hashing.
     * Utilizes the {@link https://github.com/trendmicro/tlsh/blob/master/js_ext/tlsh.js | trendmicro/tlsh } 
     * library for LSH. See changes/updates made to the original library 
     * {@link https://github.com/turecarlson/tlsh/commits/master/js_ext/tlsh.js | here}
     * @param textContent 
     */
    protected getLSHValue(textContent : string) : string {
        let tlsh = new Tlsh();
        tlsh.finale(textContent, textContent.length+1);
        return tlsh.hash().toString();
    }
    
    /**
     * Creates our AnalysisResultEntry of the given node (ParseTree)
     * @param parseTree the node from which we will compose an AnalysisResultEntry
     */
    protected createAnalysisResultEntry(parseTree : ParseTree) : AnalysisResultEntry {
        
        let hashValue = this.getLSHValue(parseTree.toStringTree());
        let submissionId = this.submission.getId();
        let contextType;
        let textContent;
        let lineStart;
        let lineStop;
        let charPosStart;
        let charPosStop;
        if(parseTree instanceof ParserRuleContext) {
        //Cast ParseTree to ParserRuleContext to access certain tokens and properties
            let asParserRuleContext = parseTree as ParserRuleContext;
            textContent = asParserRuleContext.text;
            contextType = JavaParser.ruleNames[asParserRuleContext.ruleContext.ruleIndex];
            lineStart = asParserRuleContext._start.line;
            lineStop = asParserRuleContext._stop.line;
            charPosStart = asParserRuleContext._start.charPositionInLine;
            charPosStop = asParserRuleContext._stop.charPositionInLine;
        }
        return new AnalysisResultEntry(submissionId, this.filePath, contextType, lineStart, charPosStart, lineStop, charPosStop, hashValue, textContent);
    }

    /**
     * Modification of inherited method from {@abstract}
     * See {@inheritdoc}
     * Tries to create an AnalysisResultEntry object from the given ParseTree.
     * If tlsh.hash() throws an error, the AnalysisResultEntry object is not created, and an error is thrown.
     * @param parseTree The ParseTree to be visited (root node)
     */
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
            err.message.includes("ERROR: not enough variation in input - ")) {
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

    /**
     * Modification of inherited method from {@abstract}
     * See {@inheritdoc}
     * Attempts to create an AnalysisResultEntry object of each child. 
     * If tlsh.hash() throws an error during {@link getLSHValue}, object creation 
     * is skipped, and subtree (child) is not visited, for efficiency.
     * @param node the current node, whose children may be visited.
     */
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
                err.message.includes("ERROR: not enough variation in input - ")) {
                    //Skip this node
                } else {
                    throw err;
                }
            }
        }
        return result;
    }

    /**
     * Returns this.analysisResultEntries. Throws an error if no visit has been executed.
     */

    getAnalysisResultEntries() : AnalysisResultEntry[] {
        if (this.hasVisited()) {
            return this.analysisResultEntries;
        } else {
            throw new Error("Visitor has not visited a ParseTree");
        }
    }
}