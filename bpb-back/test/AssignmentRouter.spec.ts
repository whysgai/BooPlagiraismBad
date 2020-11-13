import { expect } from "chai";

import bodyParser from "body-parser";
import AssignmentRouter from "../src/router/AssignmentRouter"
import express from "express";
import IRouter from "../src/router/IRouter";

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
    
    it('should say hi back when GET /helloworld is queried',() => {
        chai.request(testServer).get("/assignments/helloworld").then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("response","the world and the bpb-back assignment router say hi back!!");
        });
    });

    it("Should be able to interpret a request to POST /assignment to create an assignment");

    //TODO: Spy on AssignmentManager(?)
    it("Should be able to interpret a request to GET /assignment to get all assignments");

    it("Should be able to interpret a request to GET /assignment/{id} where {id} is valid");

    it("Should be able to interpret a failed request to GET /assignment/{id} where {id} is invalid");

    it("Should be able to interpret a request to PUT /assignment/{id} where {id} is valid");

    it("Should be able to interpret a failed request to PUT /assignment/{id} where {id} is invalid");

    it("Should be able to interpret a request to DELETE /assignment/{id} where {id} is valid");

    it("Should be able to interpret a failed request to DELETE /assignment/{id} where {id} is invalid");

});