import { AnalysisResultEntry } from "./model/AnalysisResultEntry";

export interface IAnalysisResult {
    asJSON() : Object
    addMatch(analysisResultEntryA : AnalysisResultEntry, analysisResultEntryB : AnalysisResultEntry) : void
}

/**
 * Represents a list of matches (i.e associations) between AnalysisResultEntries, representing matches between highlighted sections
 */
export class AnalysisResult implements IAnalysisResult {
    
    private analysisMatches : Array<AnalysisResultEntry[]>; 

    constructor() {
        this.analysisMatches = [];
    }

    /**
     * Adds a match
     * @param analysisResultEntryA 
     * @param analysisResultEntryB 
     */
    addMatch(analysisResultEntryA : AnalysisResultEntry, analysisResultEntryB : AnalysisResultEntry) {
        let analysisMatch = [];
        analysisMatch.push(analysisResultEntryA);
        analysisMatch.push(analysisResultEntryB);
        this.analysisMatches.push(analysisMatch);
    }

    /**
     * Returns the object as a JSON object
     * @returns object
     */
    asJSON(): Object {
        return this.analysisMatches.map((match) => {
            return [match[0].asJSON(), match[1].asJSON()];
        });
        
    }
}