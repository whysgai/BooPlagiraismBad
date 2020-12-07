/**
 * This is a submission type. Submissions are created and deleted by users in the client side.
 * An submission consists of an ID, a name, an assignment that it is associated with and a list of files.
 */
type Submission = {
    _id : string
    name : string
    assignment : string
    files : string[]
}

export default Submission