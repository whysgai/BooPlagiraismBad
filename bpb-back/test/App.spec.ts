import { expect } from "chai";
import App from "../src/App";

describe('App.ts',()=> {
    it('Should run and not explode', () => {
        var app = new App("mongodb://127.0.0.1:27017/bpbapptest","8081");
        expect(app).to.not.be.undefined;
        app.run(); 
    });
});