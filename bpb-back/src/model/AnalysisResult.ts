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

        if(similarityScore < 0) {
            throw new Error("Bad Constructor: param 'similarityScore' must be <= 0.");
        }
        
        if(matches.length == 0 && similarityScore != 0) {
            throw new Error("Bad Constructor: if no matches are provided, param 'similarityScore' should be 0.");
        }
        // let file1_filepath : string;
        let file1_submissionId : string;
        // let file2_filepath : string;
        let file2_submissionId : string;
        if(matches[0] != undefined) {
            if(matches[0][0] != undefined) {
                // file1_filepath = matches[0][0].getFilePath();
                file1_submissionId = matches[0][0].getSubmissionID();
            }
            if(matches[0][1] != undefined) {
                // file2_filepath = matches[0][1].getFilePath();
                file2_submissionId = matches[0][1].getSubmissionID();
            }       
            matches.forEach(match => {
                if(match == undefined) {
                    throw new Error("Bad Constructor: sub-array'matches[*]' must not be undefined.");//TODO add test for this
                }
                if(match[0] == undefined || match[1] == undefined) {
                    throw new Error("Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined.");
                }
                if(match[0] ==  match[1]) {
                    throw new Error("Bad Constructor: the two entries in a match at 'match[*]' must not be the same AnalysisResultEntry object instance.");
                }
                if(match[0].getFilePath() === match[1].getFilePath()) {
                    throw new Error("Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same filepath.");
                }
                if(match[0].getSubmissionID() === match[1].getSubmissionID()) {
                    throw new Error("Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same submissionId.");
                }
                if(match[0].getSubmissionID() != file1_submissionId) {
                    throw new Error("Bad Constructor: all entries in param 'matches[*][0]' must have the same submissionId.");
                }
                if(match[1].getSubmissionID() != file2_submissionId) {
                    throw new Error("Bad Constructor: all entries in param 'matches[*][1]' must have the same submissionId.");
                }
            });
        }
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
            
            