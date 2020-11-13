export interface IAnalysisResultEntry {
    asJSON() : JSON
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

    constructor(submissionId : String, filePath : String, contextType : String, lineNumberStart : number, lineNumberEnd : number, hashValue : String, text : String) {
        //TODO
    }
    getLineNumberStart(): number {
        throw new Error("Method not implemented.");
    }
    getLineNumberEnd(): number {
        throw new Error("Method not implemented.");
    }
    getText(): String {
        throw new Error("Method not implemented.");
    }
    getFilePath(): String {
        throw new Error("Method not implemented.");
    }
    getContextType(): String {
        throw new Error("Method not implemented.");
    }

    asJSON(): JSON {
        throw new Error("Method not implemented.");
    }

    getHashValue(): String {
        throw new Error("Method not implemented.");
    }
}