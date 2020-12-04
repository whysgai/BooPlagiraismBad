import { expect } from "chai";
import { AppConfig } from "../src/AppConfig";

//NOTE: test env variables are specified in test scripts (scripts/test_*) due to scope
describe("AppConfig",() => {
    
    describe("port()",() => {
        it("returns the expected environment variable",() => {
            expect(AppConfig.port()).to.equal("8081");
        });
    });

    describe("dbConnectionString()",() => {
        it("returns the expected environment variable",() =>  {
            expect(AppConfig.dbConnectionString()).to.equal("mongodb://127.0.0.1:27017/bpbtest");
        });
     });

     describe("maxFileUploadSize()",() => {
         it("returns the expected max file size",() => {
             expect(AppConfig.maxFileUploadSize()).to.equal(1000);
         })
     })

     describe("comparisonThreshold()",() => {
        it("returns the expected comparison threshold",() => {
            expect(AppConfig.comparisonThreshold()).to.equal(60);
        });
     });

     describe("maxMatchesPerFile",() => {
        it("returns the expected max matches value",() => {
            expect(AppConfig.maxMatchesPerFile()).to.equal(50);
        });
     });
});