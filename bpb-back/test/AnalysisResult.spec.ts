import { expect } from "chai";
import { AnalysisResult } from "../src/AnalysisResult";
import { AnalysisResultEntry } from "../src/AnalysisResultEntry";

describe.skip("AnalysisResult.ts",() => {
    describe("asJSON / addMatch",() => {
        it("Should return a valid JSON object with the expected properties",() => {
            var expected = '[[{"sub_id":"subid1","file_path":"/test/file.java","context":"method","start":1,"end":2,"hash":"245rr1","text":"void test() { }"},{"sub_id":"subid2","file_path":"/test/file2.java","context":"method","start":5,"end":6,"hash":"423qq1","text":"void similar() { }"}]]'
            var expectedJSON = JSON.parse(expected);
            var analysisResult = new AnalysisResult();
            analysisResult.addMatch(
                new AnalysisResultEntry("subid1","/test/file.java","method",1,2,"245rr1","void test() { }"),
                new AnalysisResultEntry("subid2","test/file2.java","method",5,6,"423qq1","void similar() { }")
            );
            expect(analysisResult.asJSON).to.equal(expectedJSON);
        });
    })
})