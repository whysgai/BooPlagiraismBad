import { expect } from "chai";

import bodyParser from "body-parser";
import AssignmentRouter from "../src/AssignmentRouter"
import express from "express";
import IRouter from "../src/IRouter";

import chai = require("chai");
import chaiHttp = require("chai-http");


describe('AssignmentRouter.ts',()=> {
    
    var testServer : any;
    var testRouter : IRouter;

    before(function() {

        let app = express();
        app.use(express.json());
        app.use(bodyParser.json());            
        chai.use(chaiHttp);

        testRouter = new AssignmentRouter(app,"/assignments"); 
        testServer = app.listen(8081);

    });

    it('should return a hardcoded response message when GET / is queried',() => {
        chai.request(testServer).get("/assignments/").then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("response","Normally you would expect to see assignments here, but this is hardcoded.");
        });
    });

});