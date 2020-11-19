import { expect } from "chai";

import bodyParser from "body-parser";
import SubmissionRouter from "../src/router/SubmissionRouter"
import express from "express";
import IRouter from "../src/router/IRouter";
import fs from 'fs';
import chai = require("chai");
import chaiHttp = require("chai-http");
import chaiSpies = require("chai-spies");
import superagent from "superagent";
import { SubmissionManager } from "../src/manager/SubmissionManager";
import { SubmissionDAO } from "../src/model/SubmissionDAO";
import { AssignmentDAO } from "../src/model/AssignmentDAO";
import { AssignmentManager } from "../src/manager/AssignmentManager";

describe('SubmissionRouter.ts',()=> {
    
    var app : express.Application;
    var testServer : any;
    var testRouter : IRouter;
    var testSubmissionManager : SubmissionManager;
    var testSubmissionDAO: SubmissionDAO;

    before(() => {
        chai.use(chaiHttp);
        chai.use(chaiSpies);
    });

<<<<<<< HEAD
    after(() => {
        testServer.close();
    });

    it.skip('should say hi back when GET /helloworld is queried',() => {
        return chai.request(testServer).get("/submissions/helloworld").then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("response","the world and the bpb-back submission router say hi back!!");
        });
=======
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(bodyParser.json());      
        
        testSubmissionDAO = new SubmissionDAO();
        testSubmissionManager = new SubmissionManager(testSubmissionDAO);
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager); 
        testServer = app.listen(8081);
>>>>>>> 1efb470 (BPB-30 fix: Resolve merge commit)
    });

    it.skip("Should be able to interpret a request to POST /submissions/upload to submit a file",() => {
        
        //NOTE: This is technically only passing against the live app (note port is not 8081)
        superagent.post('http://localhost:8080/submissions/sub1/files').attach('submissionfile',fs.readFileSync("./test/App.spec.ts"))
        //chai.request(testServer).post("/submissions/upload").attach("submissionfile",fs.readFileSync("./test/App.spec.ts"))
        .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("response","File uploaded successfully.");
        });
    });
    
    it("Should be able to interpret a request to POST /submissions to create a submission");
    it("Should be able to interpret a request to GET /submissions to get all submissions");
    it("Should be able to interpret a request to GET /submissions/{id} where {id} is valid");
    it("Should be able to interpret a failed request to GET /submission/{id} where {id} is invalid");
    it("Should be able to interpret a request to PUT /submissions/{id} where {id} is valid");
    it("Should be able to interpret a failed request to PUT /submissions/{id} where {id} is invalid");
    it("Should be able to interpret a request to DELETE /submissions/{id} where {id} is valid");
    it("Should be able to interpret a failed request to DELETE /submissions/{id} where {id} is invalid");
    it("Should be able to interpret a request to GET /submission/compare?a={submission_id_1}&b={submission_id_2}");
    it("Should be able to interpret a failed request to GET /submissions/compare?a={submission_id_1}&b={submission_id_2} (1 does not exist)");
    it("Should be able to interpret a failed request to GET /submissions/compare?a={submission_id_1}&b={submission_id_2} (2 does not exist)");
});