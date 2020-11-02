import { IAnalysisResult } from "./AnalysisResult";

export interface ISubmission {
    compare(otherSubmission : ISubmission) : IAnalysisResult
}

export class Submission implements ISubmission {
    //private id : String;
    //private name : String;
   // private submissionASTs : SubmissionAST[];
    
    compare(otherSubmission: ISubmission) : IAnalysisResult {
        throw new Error("Method not implemented.");
    }
}