
/**
 * This is an assignment type. Assignments are set, updated and deleted by users in the client side.
 * An assignment consists of an ID, a name, and a sting of submission IDs.
 */
type Assignment = {
    _id: String,
    name: String,
    submissionIds: String[]
}

export default Assignment