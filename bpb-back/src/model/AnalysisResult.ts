import { AnalysisResultEntry, IAnalysisResultEntry } from "./AnalysisResultEntry";

export interface IAnalysisResult {
    asJSON() : Object
    addMatch(analysisResultEntryA : IAnalysisResultEntry, analysisResultEntryB : IAnalysisResultEntry) : void
}

/**
 * Represents a list of matches (i.e associations) between AnalysisResultEntries, representing matches between highlighted sections
 */
export class AnalysisResult implements IAnalysisResult {
    
    private matches : Array<IAnalysisResultEntry>[];

    constructor() {
        this.matches = [];
    }

    addMatch(analysisResultEntryA : IAnalysisResultEntry, analysisResultEntryB : IAnalysisResultEntry) {
        this.matches.push([analysisResultEntryA,analysisResultEntryB]);
    }

    asJSON(): Object {
        return this.matches.map((match) => { return [match[0].asJSON() , match[1].asJSON()] });
    }
}