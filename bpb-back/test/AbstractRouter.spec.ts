import { expect } from "chai";

import bodyParser from "body-parser";
import AbstractRouter from "../src/AbstractRouter"
import express from "express";
import IRouter from "../src/IRouter";

import chai = require("chai");
import chaiHttp = require("chai-http");

class FakeRouter extends AbstractRouter {
    constructor(app : any, route : string) {
        super(app,route);
    }
}

describe('AbstractRouter.ts',()=> {
    
    var testServer : any;
    var testRouter : IRouter;

    before(function() {

        let app = express();
        app.use(express.json());
        app.use(bodyParser.json());            
        chai.use(chaiHttp);

        testRouter = new FakeRouter(app,"/"); //Fake implementation class for testing purposes
        testServer = app.listen(8081, function () {});

    });

    it('should return Not Yet Implemented when GET / is queried',() => {
        chai.request(testServer).get("/").then(res  => {
            expect(res).to.have.status(400);
            expect(res.text).contains("Router does not support GET requests");
        });
    });
    
    it('should return Not Yet Implemented when PUT / is queried',() => {
        chai.request(testServer).put("/").then(res  => {
            expect(res).to.have.status(400);
            expect(res.text).contains("Router does not support PUT requests");
        });
    });
    
    it('should return Not Yet Implemented when POST / is queried',() => {
        chai.request(testServer).post("/").then(res  => {
            expect(res).to.have.status(400);
            expect(res.text).contains("Router does not support POST requests");
        });
    });
    
    it('should return Not Yet Implemented when DELETE / is queried',() => {
        chai.request(testServer).delete("/").then(res  => {
            expect(res).to.have.status(400);
            expect(res.text).contains("Router does not support DELETE requests");
        });
    });
});