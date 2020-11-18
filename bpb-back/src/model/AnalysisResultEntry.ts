import mongoose, { Document, Schema } from "mongoose";

/**
 * Represents an Analysis database model object
 */
export interface IAnalysisResultEntryModel extends Document {
    _id: String,
    submissionId : String, 
    filePath : String, 
    contextType : String, 
    lineNumberStart : Number, 
    lineNumberEnd : Number,
    hashValue : String, 
    text : String
}


export interface IAnalysisResultEntry {
    asJSON() : Object 
    getHashValue(): string
    getFilePath(): string
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

    private static analsysResultEntrySchema = new Schema ({
        _id: String,
        submissionId : String, 
        filePath : String, 
        contextType : String, 
        lineNumberStart : Number, 
        lineNumberEnd : Number,
        hashValue : String, 
        text : String
    })

    private static analysisResultEntryModel = mongoose.model<IAnalysisResultEntryModel>(
        'AnalysisResultEntry', AnalysisResultEntry.analsysResultEntrySchema
        );


    constructor(
        private id : String,
        private submissionId : String, 
        private filePath : String, 
        private contextType : String, 
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
        this.filePath = filePath;
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
    getFilePath(): string {
        return this.filePath;
    }
    getContextType(): string {
        return this.contextType;
    }
    getHashValue(): String {
        return this.hashValue;
    }
    asJSON(): Object {
        // throw new Error("Method not implemented.");
        return {
            id:this.id,
            submissionId:this.submissionId,
            filePath:this.filePath,
            contextType:this.contextType,
            lineNumberStart:this.lineNumberStart,
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
            "filePath":this.filePath,
            "contextType":this.contextType,
            "lineNumberStart":this.lineNumberStart,
            "lineNumberEnd":this.lineNumberEnd,
            "hashValue":this.hashValue,
            "text":this.text
        });
    }
    

}
