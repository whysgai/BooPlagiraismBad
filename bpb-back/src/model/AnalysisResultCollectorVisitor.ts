import {AnalysisResultEntry} from "../AnalysisResultEntry"

interface IAnalysisResultCollectorVisitor {
    getAnalysisResultEntries(): AnalysisResultEntry[]    
}

//TODO: Add extension of AbstractParseTreeVisitor (including actual visit methods, etc)
class AnalysisResultCollectorVisitor implements IAnalysisResultCollectorVisitor{
     
    getAnalysisResultEntries() : AnalysisResultEntry[] {
        return [] //TODO
    }
}