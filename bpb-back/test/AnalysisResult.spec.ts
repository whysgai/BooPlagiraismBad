import { expect } from "chai";
import { AnalysisResult } from "../src/AnalysisResult";

describe("AnalysisResult.ts",() => {
    describe("asJSON",() => {
        it("Should return a valid JSON object with the expected properties",() => {

            var expected = '[{"fromSubmission":"id1","toSubmission":"id2","fromFile":"testa","toFile":"testb","fromStart":1,"fromEnd":2,"toStart":3,"toEnd":6,"type":"BasicMatch","description":"Test description"}]'
            var expectedJSON = JSON.parse(expected);
            var analysisResult = new AnalysisResult("id1","id2");
            analysisResult.addMatch("testa","testb",1,2,3,6,"BasicMatch","Test Description");
            expect(analysisResult.asJSON).to.equal(expectedJSON);
        });
    })

    describe("addMatch",() => {
        it("should correctly add match entries (that are then returned correctly)",() =>{
            var expected = '[{"fromSubmission":"ida","toSubmission":"idb","fromFile":"ta","toFile":"tb","fromStart":10,"fromEnd":2,"toStart":3,"toEnd":10,"type":"BasicMatch","description":"Test description 1"},{"fromSubmission":"ida","toSubmission":"idb","fromFile":"testa","toFile":"testb","fromStart":1,"fromEnd":2,"toStart":3,"toEnd":6,"type":"BasicMatch","description":"Test description 2"}]'
            var expectedJSON = JSON.parse(expected);
            var analysisResult = new AnalysisResult("ida","idb");
            analysisResult.addMatch("ta","bb",10,2,3,10,"BasicMatch","Test Description 1");
            analysisResult.addMatch("testa","testb",1,2,3,6,"BasicMatch","Test Description 2");
            expect(analysisResult.asJSON).to.equal(expectedJSON);
        });
    });
})