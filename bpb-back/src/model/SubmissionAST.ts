import {IAnalysisResult} from '../AnalysisResult';

export interface ISubmissionAST {
    compare(otherSubmissionAST : ISubmissionAST) : IAnalysisResult
    add(submissionAST : ISubmissionAST) : void
    remove(submissionAST : ISubmissionAST) : void
    getChild(submissionAST : ISubmissionAST) : void
    getValue() : String
}

export class SubmissionASTNode implements ISubmissionAST {
    compare(otherSubmissionAST: ISubmissionAST): IAnalysisResult {
        throw new Error('Method not implemented.');
    }
    add(submissionAST: ISubmissionAST): void {
        throw new Error('Method not implemented.');
    }
    remove(submissionAST: ISubmissionAST): void {
        throw new Error('Method not implemented.');
    }
    getChild(submissionAST: ISubmissionAST): void {
        throw new Error('Method not implemented.');
    }
    getValue(): String {
        throw new Error('Method not implemented.');
    }

}

export class SubmissionASTLeaf implements ISubmissionAST {
    compare(otherSubmissionAST: ISubmissionAST): IAnalysisResult {
        throw new Error('Method not implemented.');
    }
    getValue(): String {
        throw new Error('Method not implemented.');
    }

    //Unsupported operations
    add(submissionAST: ISubmissionAST): void {
        throw new Error('Method not Supported.');
    }
    remove(submissionAST: ISubmissionAST): void {
        throw new Error('Method not Supported.');
    }
    getChild(submissionAST: ISubmissionAST): void {
        throw new Error('Method not Supported.');
    }

}