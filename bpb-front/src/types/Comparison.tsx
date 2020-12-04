import Snippet from "./Snippet"

type Comparison = {
    files: String[][],
    matches: Snippet[][],
    similarityScore: number
}

export default Comparison