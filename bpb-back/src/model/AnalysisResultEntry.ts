export interface IAnalysisResultEntry {
    asJSON() : Object 
    getHashValue(): string
    getFilePath(): string
    getContextType(): string
    getLineNumberStart(): number
    getLineNumberEnd(): number
    getText(): string
}

/**
 * Represents a single entry in an analysis result.
 * Corresponds to a single hashed AST subtree element and metadata
 */
export class AnalysisResultEntry implements IAnalysisResultEntry {

    constructor(private submissionId : string, 
        private filePath : string, 
        private contextType : string, 
        private lineNumberStart : number,
        private charPosStart : number, 
        private lineNumberEnd : number,
        private charPosEnd : number,
        private hashValue : string, 
        private text : string) {
            
        if (lineNumberStart > lineNumberEnd) {
            throw new Error('lineNumberStart can not be > lineNumberEnd');
        }
    }

    getSubmissionID(): string {
        return this.submissionId;
    }
    getLineNumberStart(): number {
        return this.lineNumberStart;
    }
    getLineNumberEnd(): number {
        return this.lineNumberEnd;
    }
    getCharPosStart(): number {
        return this.charPosStart;
    }
    getCharPosEnd(): number {
        return this.charPosEnd;
    }
    getText(): string {
        return this.text;
    }
    getFilePath(): string {
        return this.filePath;
    }
    getContextType(): string {
        return this.contextType;
    }

    asJSON(): Object {
       return JSON.parse(JSON.stringify(this)); 
    }

    getHashValue(): string {
        return this.hashValue;
    }
}

