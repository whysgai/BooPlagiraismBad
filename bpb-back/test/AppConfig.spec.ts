import { expect } from "chai";
import { AppConfig } from "../src/AppConfig";

describe("AppConfig",() => {
    
    describe("port()",() => {
        it("returns the expected environment variable",() => {
            expect(AppConfig.port()).to.not.be.undefined;
        });
    });

    describe("dbConnectionString()",() => {
       it("returns the expected environment variable",() =>  {
           expect(AppConfig.dbConnectionString()).to.not.be.undefined;
       });
    });

    describe("submissionFileUploadDirectory()",() => {
        it("returns the expected environment variable",() => {
            expect(AppConfig.submissionFileUploadDirectory()).to.not.be.undefined;
        });
    });
});