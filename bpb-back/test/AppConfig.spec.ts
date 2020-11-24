import { expect } from "chai";
import { AppConfig } from "../src/AppConfig";

//NOTE: test env variables are specified in package.json test script due to scope
//Additionally, maxFileUploadSize test env value is referenced (indirectly) in SubmissionRouter.spec
describe("AppConfig",() => {
    
    describe("port()",() => {
        it("returns the expected environment variable",() => {
            expect(AppConfig.port()).to.equal("test1");
        });
    });

    describe("submissionFileUploadDirectory()",() => {
        it("returns the expected environment variable",() => {
            expect(AppConfig.submissionFileUploadDirectory()).to.equal("test2");
        });
    });

    describe("dbConnectionString()",() => {
        it("returns the expected environment variable",() =>  {
            expect(AppConfig.dbConnectionString()).to.equal("test3");
        });
     });

     describe("maxFileUploadSize()",() => {
         it("returns the expected max file size",() => {
             expect(AppConfig.maxFileUploadSize()).to.equal(1000);
         })
     })
});