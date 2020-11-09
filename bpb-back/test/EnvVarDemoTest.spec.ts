import { expect } from "chai";

describe("Back-End Env Var Test.ts",() => {
   it("Should return the content of the designated environment variable", () => {
       expect(process.env.REACT_APP_TESTVAR).to.equal("Hello, World!");
   });
 
});