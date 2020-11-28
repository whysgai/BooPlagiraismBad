import { AnalysisResultEntry, IAnalysisResultEntry } from "./AnalysisResultEntry";
export interface IAnalysisResult {
    asJSON() : Object;
    getSimilarityScore() : number;
    getMatches() : Array<Array<IAnalysisResultEntry>>; 
    getFiles() : Map<string, string>;
}

/**
 * Represents a list of matches (i.e associations) between AnalysisResultEntries, representing matches between highlighted sections
 */
export class AnalysisResult implements IAnalysisResult {
    private fileNames : Map<string, string>; // key: submissionId, val: fileName

    constructor(private matches : Array<Array<IAnalysisResultEntry>>, private similarityScore : number, 
        submissionIdA : string, submissionIdB : string, filePathA : string, filePathB : string) {
        
        if(submissionIdA == undefined || submissionIdB == undefined || submissionIdA === "" || submissionIdB === "") {
            throw new Error('Provided submissionId values must not be undefined or empty strings');
        }
        
        if(filePathA == undefined || filePathB == undefined || filePathA === "" || filePathB === "") {
            throw new Error('Provided filePath values must not be undefined or empty strings');
        }

        if(similarityScore < 0) {
            throw new Error("Bad Constructor: param 'similarityScore' must be <= 0.");
        }
        
        if(matches.length == 0 && similarityScore != 0) {
            throw new Error("Bad Constructor: if no matches are provided, param 'similarityScore' should be 0.");
        }
        
        matches.forEach(match => {
            if(match == undefined) {
                throw new Error("Bad Constructor: sub-array'matches[*]' must not be undefined.");
            }
            if(match[0] == undefined || match[1] == undefined) {
                throw new Error("Bad Constructor: AnalysisResultEntry objects in param 'matches' must not be undefined.");
            }
            if(match[0] ==  match[1]) {
                throw new Error("Bad Constructor: the two entries in a match at 'match[*]' must not be the same AnalysisResultEntry object instance.");
            }
            if(match[0].getFileName() === match[1].getFileName()) {
                throw new Error("Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same filepath.");
            }
            if(match[0].getSubmissionID() === match[1].getSubmissionID()) {
                throw new Error("Bad Constructor: entries in 'matches[*][0]' and matches[*][1] must not have the same submissionId.");
            }
            if(match[0].getSubmissionID() != submissionIdA) {
                throw new Error("Bad Constructor: all entries in param 'matches[*][0]' must have the same submissionId.");
            }
            if(match[1].getSubmissionID() != submissionIdB) {
                throw new Error("Bad Constructor: all entries in param 'matches[*][1]' must have the same submissionId.");
            }
        });

        this.fileNames = new Map<string, string>();
        this.fileNames.set(submissionIdA, filePathA).set(submissionIdB, filePathB);
    };
    
    getFiles(): Map<string, string> {
        return this.fileNames;
    }
        
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
            
            