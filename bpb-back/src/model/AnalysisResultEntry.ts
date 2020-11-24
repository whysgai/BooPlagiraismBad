import mongoose, { Document, Schema } from "mongoose";

/**
 * Represents an Analysis database model object
 */
export interface IAnalysisResultEntryModel extends Document {
    _id: string,
    submissionId : string, 
    filePath : string, 
    contextType : string, 
    lineNumberStart : Number, 
    lineNumberEnd : Number,
    hashValue : string, 
    text : string
}


export interface IAnalysisResultEntry {
    asJSON() : Object 
    getSubmissionID() : string;
    getHashValue(): string
    getFileName(): string
    getContextType(): string
    getLineNumberStart(): number
    getLineNumberEnd(): number
    getText(): string
}

/**
 * Represents a single entry in an analysis result.
 * Corresponds to a single hashed AST subtree element and metadata
 */
export class AnalysisResultEntry implements IAnalysisResultEntry {

    private static analysisResultEntrySchema = new Schema ({
        submissionId : String, 
        filePath : String, 
        contextType : String, 
        lineNumberStart : Number, 
        lineNumberEnd : Number,
        hashValue : String, 
        text : String
    })

    private static analysisResultEntryModel = mongoose.model<IAnalysisResultEntryModel>('AnalysisResultEntry', AnalysisResultEntry.analysisResultEntrySchema);

    constructor(
        private id : string,
        private submissionId : string, 
        private fileName : string, 
        private contextType : string, 
        private lineNumberStart : number,
        private charPosStart : number, 
        private lineNumberEnd : number,
        private charPosEnd : number,
        private hashValue : string, 
        private text : string) {
            
        if (lineNumberStart > lineNumberEnd) {
            throw new Error('lineNumberStart can not be > lineNumberEnd');
        }
        
        this.id = id;
        this.submissionId = submissionId;
        this.fileName = fileName;
        this.contextType = contextType;
        this.lineNumberStart = lineNumberStart;
        this.lineNumberEnd = lineNumberEnd;
        this.hashValue = hashValue;
        this.text = text;
    }

    getSubmissionID(): string {
        return this.submissionId;
    }
    getLineNumberStart(): number {
        return this.lineNumberStart;
    }
    getLineNumberEnd(): number {
        return this.lineNumberEnd;
    }
    getCharPosStart(): number {
        return this.charPosStart;
    }
    getCharPosEnd(): number {
        return this.charPosEnd;
    }
    getText(): string {
        return this.text;
    }
    getFileName(): string {
        return this.fileName;
    }
    getContextType(): string {
        return this.contextType;
    }
    getHashValue(): string {
        return this.hashValue;
    }
    asJSON(): Object {
        return {
            id:this.id,
            fileName:this.fileName,
            contextType:this.contextType,
            lineNumberStart:this.lineNumberStart,
            charPosStart:this.charPosStart,
            charPosEnd:this.charPosEnd,
            lineNumberEnd:this.lineNumberEnd,
            hashValue:this.hashValue
         }
    }
    static getStaticModel() : mongoose.Model<IAnalysisResultEntryModel> {
        return this.analysisResultEntryModel;
    }    
    getModelInstance() : Document {
        return new AnalysisResultEntry.analysisResultEntryModel({
            "id":this.id,
            "submissionId":this.submissionId,
            "fileName":this.fileName,
            "contextType":this.contextType,
            "lineNumberStart":this.lineNumberStart,
            "lineNumberEnd":this.lineNumberEnd,
            "hashValue":this.hashValue,
            "text":this.text
        });
    }
}
