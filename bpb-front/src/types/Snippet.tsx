/**
 * This is a snippet type. Snippets are selected by a user to more closely examine similar code.
 * An snippet consists of the below properties.
 */
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