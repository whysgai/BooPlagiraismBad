type Snippet = {
    id: String,
    submissionId: String,
    fileName: String,
    lineNumberStart: Number,
    charPosStart: Number,
    lineNumberEnd: Number,
    charPosEnd: Number,    
    contextType: String,  
    text: String,  
    hashValue: String
}

export default Snippet