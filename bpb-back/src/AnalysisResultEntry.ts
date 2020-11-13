export interface IAnalysisResultEntry {
    asJSON() : JSON
}

/**
 * Represents a single entry in an analysis result.
 * Corresponds to a single hashed AST subtree element and metadata
 */
export class AnalysisResultEntry implements IAnalysisResultEntry {

    constructor(submissionId : String, contextType : String, lineNumberStart : number, lineNumberEnd : number, hashValue : String, text : String) {
        //TODO
    }

    asJSON(): JSON {
        throw new Error("Method not implemented.");
    }
}