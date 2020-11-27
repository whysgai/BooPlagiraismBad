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
    }

    /**
     * Return the submission Id associated with this entry
     * @returns submission Id
     */
    getSubmissionID(): string {
        return this.submissionId;
    }

    /**
     * Returns the starting line number associated with this entry
     * @returns starting line number
     */
    getLineNumberStart(): number {
        return this.lineNumberStart;
    }
    
    /**
     * Returns the ending line number associated with this entry
     * @returns ending line  number
     */
    getLineNumberEnd(): number {
        return this.lineNumberEnd;
    }

    /**
     * Returns the starting character position associated with this entry
     * @returns starting character position
     */
    getCharPosStart(): number {
        return this.charPosStart;
    }

    /**
     * Returns the ending character position associated with this entry
     * @returns ending character position
     */
    getCharPosEnd(): number {
        return this.charPosEnd;
    }

    /**
     * Returns the raw AST text associated with this entry (value used to create hash)
     * @returns raw AST text as a string
     */
    getText(): string {
        return this.text;
    }

    /**
     * Returns the name of the file that this entry was derived from
     * @returns filename as a string
     */
    getFileName(): string {
        return this.fileName;
    }

    /**
     * Returns the context of the entry (i.e. which AST element the entry was derived from)
     * @returns the context of the entry as a string
     */
    getContextType(): string {
        return this.contextType;
    }

    /**
     * Returns the comparison hash value of the entry (derived during parsing)
     * @returns the hash value of the entry as a string
     */
    getHashValue(): string {
        return this.hashValue;
    }

    /**
     * Returns the object as a JSON object
     * @returns object as JSON
     */
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

    /**
     * Returns the static model for AnalysisResultEntry database model
     * @returns Mongoose static model for AnalysisResultEntry
     */
    static getStaticModel() : mongoose.Model<IAnalysisResultEntryModel> {
        return this.analysisResultEntryModel;
    }  
    
    /**
     * Returns a new Mongoose document model instance for the current entry
     * @returns Mongoose document model instance
     */
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