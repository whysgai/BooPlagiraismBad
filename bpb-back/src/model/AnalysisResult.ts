import { AnalysisResultEntry } from "./AnalysisResultEntry";

export interface IAnalysisResult {
    asJSON() : JSON
    addMatch(analysisResultEntryA : AnalysisResultEntry, analysisResultEntryB : AnalysisResultEntry) : void
}

/**
 * Represents a list of matches (i.e associations) between AnalysisResultEntries, representing matches between highlighted sections
 */
export class AnalysisResult implements IAnalysisResult {
    
    constructor() {
        //TODO
    }

    addMatch(analysisResultEntryA : AnalysisResultEntry, analysisResultEntryB : AnalysisResultEntry) {
        //TODO
    }

    asJSON(): JSON {
        throw new Error("Method not implemented.");
    }
}