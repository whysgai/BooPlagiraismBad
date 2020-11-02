export interface IAnalysisResult {
    asJSON() : JSON
}

export class AnalysisResult implements IAnalysisResult {
    asJSON(): JSON {
        throw new Error("Method not implemented.");
    }
}