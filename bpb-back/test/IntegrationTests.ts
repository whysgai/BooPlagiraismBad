import App from "../src/App";
import { AppConfig } from "../src/AppConfig";

/**
 * App Integration Tests
 */
describe("App (Integration)",() =>  {

    var app  : App;

    before((done) => {
        app = new App(AppConfig.dbConnectionString(),AppConfig.port());
        done();
    });

    after((done) => {
        app.shutDown();
        done();
    });
    it('should correctly create a submission (end-to-end)');
});