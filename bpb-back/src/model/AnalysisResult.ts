import { AnalysisResultEntry, IAnalysisResultEntry } from "./AnalysisResultEntry";
export interface IAnalysisResult {
    asJSON() : Object;
    getSimilarityScore() : number;
    getMatches() : Array<Array<IAnalysisResultEntry>>; 
}

/**
 * Represents a list of matches (i.e associations) between AnalysisResultEntries, representing matches between highlighted sections
 */
export class AnalysisResult implements IAnalysisResult {

    constructor(private matches : Array<Array<IAnalysisResultEntry>>, private similarityScore : number) {
        matches.forEach(match => {
            if(match[0] == undefined || match[1] == undefined) {
                throw new Error('Analy')
            }
            
        });
    };

    getSimilarityScore(): number {
        return this.similarityScore;
    }

    getMatches() : Array<Array<IAnalysisResultEntry>> {
        return this.matches;
    }

    asJSON(): Object {
        return {'similarityScore': this.similarityScore,
                'matches': this.matches.map((match) => { return [match[0].asJSON() , match[1].asJSON()] })};  
    }


}