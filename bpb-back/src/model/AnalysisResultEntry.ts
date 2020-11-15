export interface IAnalysisResultEntry {
    asJSON() : Object 
    getHashValue(): String
    getFilePath(): String
    getContextType(): String
    getLineNumberStart(): number
    getLineNumberEnd(): number
    getText(): String
}

/**
 * Represents a single entry in an analysis result.
 * Corresponds to a single hashed AST subtree element and metadata
 */
export class AnalysisResultEntry implements IAnalysisResultEntry {

    constructor(private submissionId : String, 
        private filePath : String, 
        private contextType : String, 
        private lineNumberStart : number, 
        private lineNumberEnd : number,
        private hashValue : String, 
        private text : String) {
            
        if (lineNumberStart > lineNumberEnd) {
            throw new Error('lineNumberStart can not be > lineNumberEnd');
        }
    }

    getSubmissionID(): String {
        return this.submissionId;
    }
    getLineNumberStart(): number {
        return this.lineNumberStart;
    }
    getLineNumberEnd(): number {
        return this.lineNumberEnd;
    }
    getText(): String {
        return this.text;
    }
    getFilePath(): String {
        return this.filePath;
    }
    getContextType(): String {
        return this.contextType;
    }

    asJSON(): Object {
       return JSON.parse(JSON.stringify(this)); 
    }

    getHashValue(): String {
        return this.hashValue;
    }
}

