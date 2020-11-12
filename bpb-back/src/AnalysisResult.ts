export interface IAnalysisResult {
    asJSON() : JSON
    addMatch(submission_A_file : String, submission_B_file : String, fromLineA: number, toLineA: number, fromLineB: number, toLineB: number, matchType : String, description : String) : void;
}

export class AnalysisResult implements IAnalysisResult {
    
    constructor(submission_A_ID : String, submission_B_ID : String) {
        //TODO
    }

    addMatch(submission_A_file : String, submission_B_file : String, fromLineA: number, toLineA: number, fromLineB: number, toLineB: number, matchType : String, description : String) {
        //TODO
    }

    asJSON(): JSON {
        throw new Error("Method not implemented.");
    }
}