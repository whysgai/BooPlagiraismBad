import { expect } from "chai";
import App from "../src/App";
import { AppConfig } from "../src/AppConfig";

describe('App.ts',()=> {

    it('Should run, not explode, and shut down gracefully', () => {
        
        let app = new App(AppConfig.dbConnectionString(),AppConfig.port());
        
        expect(app).to.not.be.undefined;
        
        return app.run().then((res) => {
            app.shutDown();
        })
    });

    it("Should throw an appropriate error if a database connection can't be acquired due to invalid connection string",() => {
        
        let app = new App("invalid_connection_string","6656");
        
        return app.run().then((res) => {
            expect(true,"App should fail to run, but it did not").to.equal(false);
        }).catch((err) => {
            expect(err).to.have.property("message").which.equals("Invalid connection string");
        })
    });
});