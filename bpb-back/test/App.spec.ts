import { assert, expect } from "chai";
import App from "../src/App";

describe('App.ts',()=> {
    it('Should run and not explode', () => {
        let app = new App();
        expect(app).to.be.not.null;
    });
});