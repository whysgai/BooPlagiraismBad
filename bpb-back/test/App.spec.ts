import { expect } from "chai";
import App from "../src/App";

describe('App.ts',()=> {

    it('Should run, not explode, and shut down gracefully', () => {
        
        var app = new App("mongodb://127.0.0.1:27017/bpbapptest","8081");
        
        expect(app).to.not.be.undefined;
        
        return app.run().then((res) => {
            app.shutDown();
        })
    });

    it("Should throw an appropriate error if a database connection can't be acquired",() => {
        var app = new App("invalid_connection_string","6656");
        expect(app).to.not.be.undefined;
    });
});