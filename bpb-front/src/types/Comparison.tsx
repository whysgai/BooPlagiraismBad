import Snippet from "./Snippet"

/**
 * This is a comparison type. Comparisons are set and updated by a user in the client side based on 
 * which submissions are being compared.
 * A comparison consists of a 2D array of files, a 2D array of matches and a similarity score.
 */
type Comparison = {
    files: String[][],
    matches: Snippet[][],
    similarityScore: number
}

export default Comparison