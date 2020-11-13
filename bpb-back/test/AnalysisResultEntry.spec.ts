import { expect } from "chai";
import { AnalysisResultEntry } from "../src/AnalysisResultEntry";

describe.skip("AnalysisResultEntry",() => {
    describe("asJSON",() => {
        it("Should return a valid JSON object with the expected properties",() => {
            var expected = '{"sub_id":"subid1","file_path":"/vagrant/bpb-back/uploads/test.java","context":"method","start":1,"end":2,"hash":"245rr1","text":"void test() { }"}'
            var expectedJSON = JSON.parse(expected);
            var analysisResultEntry = new AnalysisResultEntry("subid1","/vagrant/bpb-back/uploads/test.java","method",1,2,"245rr1","void test() { }");
            expect(analysisResultEntry.asJSON).to.equal(expectedJSON);
        });
    });
});
