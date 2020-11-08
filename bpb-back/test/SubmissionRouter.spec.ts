import { expect } from "chai";

import bodyParser from "body-parser";
import AssignmentRouter from "../src/AssignmentRouter"
import express from "express";
import IRouter from "../src/IRouter";

import chai = require("chai");
import chaiHttp = require("chai-http");


describe('SubmissionRouter.ts',()=> {
    
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

    it("Should be able to interpret a request to POST /submission to create a submission");
    it("Should be able to interpret a request to GET /submission to get all submissions");
    it("Should be able to interpret a request to GET /submission/{id} where {id} is valid");
    it("Should be able to interpret a failed request to GET /submission/{id} where {id} is invalid");
    it("Should be able to interpret a request to PUT /submission/{id} where {id} is valid");
    it("Should be able to interpret a failed request to PUT /submission/{id} where {id} is invalid");
    it("Should be able to interpret a request to DELETE /submission/{id} where {id} is valid"):
    it("Should be able to interpret a failed request to DELETE /submission/{id} where {id} is invalid");
    it("Should be able to interpret a request to GET /submission/compare?a={submission_id_1}&b={submission_id_2}");
    it("Should be able to interpret a failed request to GET /submission/compare?a={submission_id_1}&b={submission_id_2} (1 does not exist)");
    it("Should be able to interpret a failed request to GET /submission/compare?a={submission_id_1}&b={submission_id_2} (2 does not exist)");
});