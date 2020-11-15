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
import { Submission } from "../src/model/Submission";
import { AnalysisResultEntry } from "../src/AnalysisResultEntry";

describe('SubmissionRouter.ts',()=> {
    
    var app : express.Application;
    var testServer : any;
    var testRouter : IRouter;
    var testSubmissionManager : SubmissionManager;
    var testSubmissionDAO : SubmissionDAO;
    var testSubmission : Submission;
    var testARE : AnalysisResultEntry;

    before(() => {
        chai.use(chaiHttp);
        chai.use(chaiSpies);
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(bodyParser.json());      
        
        testSubmissionDAO = new SubmissionDAO();
        testSubmissionManager = new SubmissionManager(testSubmissionDAO);
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager); 
        testServer = app.listen(8081);

        testARE = new AnalysisResultEntry("ID117","subid1","/vagrant/bpb-back/uploads/test.java","method",1,2,"245rr1","void test() { }");
        testSubmission = new Submission("TestID","TestName");
        testSubmission.addAnalysisResultEntry(testARE);
    });

    it("Should be able to interpret a request to POST /submissions to create a submission", () => {
        const expectedId = "TestID";
        const expectedName = "TestName";
        const expectedAssnId = "TestAssign01";        
        const mockSubmission = new Submission("TestID", "TestName");

        const expectedJSON = mockSubmission.asJSON();

        const postBody = {"name": expectedName, "assignment_id": expectedAssnId};

        chai.spy.on(testSubmissionManager, 'createSubmission', () => {return Promise.resolve(mockSubmission)});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equals(expectedJSON);
            });
    });

    it.skip("Should be able to interpret a request to POST /submissions/upload to submit a file",() => {
        // //NOTE: This is technically only passing against the live app (note port is not 8081)
        // superagent.post('http://localhost:8080/submissions/sub1/files').attach('submissionfile',fs.readFileSync("./test/App.spec.ts"))
        // //chai.request(testServer).post("/submissions/upload").attach("submissionfile",fs.readFileSync("./test/App.spec.ts"))
        // .then((res) => {
        //     expect(res).to.have.status(200);
        //     expect(res.body).to.have.property("response","File uploaded successfully.");
        // });
    });    
    it("Should be able to interpret a request to GET /submissions to get all submissions", () => {
        const expectedSubs = [testSubmission.asJSON()];
        chai.spy.on(
            testSubmissionManager, 'getSubmissions', () => {return Promise.resolve([testSubmission])}
        );

        chai.request(testServer).get("/submissions")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal(expectedSubs)
            });
    });
    it("Should be able to interpret a request to GET /submissions/{id} where {id} is valid", () => {
        const expectedSubs = testSubmission.asJSON();
        chai.spy.on(
            testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission)}
        );

        chai.request(testServer).get("/submissions/ID117")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal(expectedSubs)
            });
    });
    it("Should be able to interpret a failed request to GET /submission/{id} where {id} is invalid", () => {
        const nonexistentId = "Ricoooooo";
        chai.spy.on(
            testSubmissionManager, 'getSubmission', () => {return Promise.reject(new Error("Submission ID not found: " + nonexistentId))}
        );
        chai.request(testServer).get("/submissions/" + nonexistentId)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Submission ID not found: " + nonexistentId);
            });
    });
    it("Should be able to interpret a request to PUT /submissions/{id} where {id} is valid", () => { 
        const postBody = testSubmission;
        chai.spy.on(testSubmissionManager, 'updateSubmission', () => {return Promise.resolve(testSubmission)});
        chai.request(testServer).put("/submissions/" + testSubmission.getId())
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equals(testSubmission.asJSON());
            });
    });
    it("Should be able to interpret a failed request to PUT /submissions/{id} where {id} is invalid", () => { 
        const nonexistentId = "drphilbertmd"
        const postBody = testSubmission;
        chai.spy.on(
            testSubmissionManager, 'updateSubmission', () => {
                Promise.reject(new Error("Submission ID not found: " + nonexistentId))
            }
        );
        chai.request(testServer).put("/submissions/" + nonexistentId)
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Submission ID not found: " + nonexistentId);
            });
    });
    it("Should be able to interpret a request to DELETE /submissions/{id} where {id} is valid", () => { 
        chai.spy.on(testSubmissionManager, 'deleteSubmission', () => {return Promise.resolve(testSubmission)});
        chai.request(testServer).delete("/submissions/" + testSubmission.getId())
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.response).to.equal("Deleted submission "+testSubmission.getId());
            });
    });
    it("Should be able to interpret a failed request to DELETE /submissions/{id} where {id} is invalid", () => { 
        const nonexistentId = "drphilbertmd"
        chai.spy.on(
            testSubmissionManager, 'deleteSubmission', () => {
                Promise.reject(new Error("Submission ID not found: " + nonexistentId))
            }
        );
        chai.request(testServer).delete("/submissions/" + nonexistentId)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Submission ID not found: " + nonexistentId);
            });
    });
    it.skip("Should be able to interpret a request to GET /submission/compare?a={submission_id_1}&b={submission_id_2}", () => {
        //TODO
        const postBody = testSubmission;
        chai.spy.on(testSubmissionManager, 'deleteSubmission', () => {return Promise.resolve(testSubmission)});
        chai.request(testServer).delete("/submissions/" + testSubmission.getId())
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.response).to.equal("Deleted submission "+testSubmission.getId());
            });
    });
    it("Should be able to interpret a failed request to GET /submissions/compare?a={submission_id_1}&b={submission_id_2} (1 does not exist)");
    it("Should be able to interpret a failed request to GET /submissions/compare?a={submission_id_1}&b={submission_id_2} (2 does not exist)");
});