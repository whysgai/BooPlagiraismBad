import {AnalysisResultEntry} from "../AnalysisResultEntry"

interface IAnalysisResultCollectorVisitor {
    getAnalysisResultEntries(): AnalysisResultEntry[]    
}

//TODO: Add extension of AbstractParseTreeVisitor (including actual visit methods, etc)
class AnalysisResultCollectorVisitor implements IAnalysisResultCollectorVisitor{
    
    constructor(filePath : String) {
        //TODO: filePath is the path to the file being processed. Don't need to retrieve contents again (done externally) - this is for inclusion in AnalysisResultEntry metadata
    }
    getAnalysisResultEntries() : AnalysisResultEntry[] {
        return [] //TODO
    }
}