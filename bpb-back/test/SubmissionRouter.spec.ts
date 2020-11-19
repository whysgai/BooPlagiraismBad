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
import { Submission, ISubmission } from "../src/model/Submission";
import { AnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { SubmissionFactory } from "../src/model/SubmissionFactory";
import { AnalysisResult } from "../src/AnalysisResult";
import { Assignment, IAssignment } from "../src/model/Assignment";


describe('SubmissionRouter.ts',()=> {
    
    var app : express.Application;
    var testServer : any;
    var testRouter : IRouter;
    var testSubmissionManager : SubmissionManager;
    var testSubmissionDAO : SubmissionDAO;
    var testAssignmentManager : AssignmentManager;
    var testAssignmentDAO : AssignmentDAO;
    var testSubmission : ISubmission;
    var testAssignment : IAssignment;
    var testAre1 : AnalysisResultEntry;
    var testAre2 : AnalysisResultEntry;
    var count : number;

    before(() => {
        chai.use(chaiHttp);
        chai.use(chaiSpies);
        count = 0;
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(bodyParser.json());      
        
        testSubmissionDAO = new SubmissionDAO();
        testSubmissionManager = new SubmissionManager(testSubmissionDAO);
        testAssignmentDAO = new AssignmentDAO();
        testAssignmentManager = new AssignmentManager(testAssignmentDAO);
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        testAssignment = new Assignment("ID998","Test Assignment")
        testSubmission = new Submission(testAssignment.getID(),"Test");
        //testSubmission = SubmissionFactory.buildSubmission(testAssignment.getID(),"Test");
        testAssignment.addSubmission(testSubmission.getId());
        testAre1 = new AnalysisResultEntry("ID117",testSubmission.getId(),"/vagrant/bpb-back/uploads/test.java","method",1,3,7,9,"245rr1","void test(Itaque quod qui autem natus illum est. Ab voluptate consequuntur nulla. Molestias odio ex dolorem cumque non ad ullam. Quo nihil voluptatem explicabo voluptas. Et facere odio rem dolores rerum eos minima quos.) { }");
        testAre2 = new AnalysisResultEntry("ID666","some_other_submission_id","/vagrant/bpb-back/uploads/testing.java","method",2,4,6,8,"245rr1","void test(Itaque quod qui autem natus illum est. Ab voluptate consequuntur nulla. Molestias odio ex dolorem cumque non ad ullam. Quo nihil voluptatem explicabo voluptas. Et facere odio rem dolores rerum eos minima quos.) { }");
        // testSubmission.addAnalysisResultEntry(testAre1);
        testSubmission.addFile("test",testAre1.getFilePath());
        
        testServer = app.listen(8081);       
    });

    it("Should be able to interpret a request to POST /submissions to create a submission", () => {
        console.log("First test");

        const postBody = {"name": testSubmission.getName(), "assignment_id": testAssignment.getID()};
        
        var mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);}
        )
        chai.spy.on(testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission)});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(200);
                expect(mockGetAssignment).to.have.been.called.with(testAssignment.getID());
                expect(res.body).to.deep.equals(testSubmission.asJSON());
            });
    });
    it("Should be able to interpret a failed request to POST /submissions to create a submission (invalid assignment id)", () => {

        const postBody = {"name": testSubmission.getName(), "assignment_id": testAssignment.getID()};
        
        var mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.reject(new Error("The requested assignment does not exist"));}
        )
        var mockCreateSubmission = chai.spy.on(testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission)});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(mockGetAssignment).to.have.been.called.with(testAssignment.getID());
                expect(mockCreateSubmission).to.have.not.been.called();
                expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            });
    });

    it("Should be able to interpret a failed request to POST /submissions to create a submission (missing property name)", () => {

        const postBody = {"assignment_id": testAssignment.getID()};
        
        var mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);});

        var mockCreateSubmission = chai.spy.on(
            testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission);});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(mockCreateSubmission).to.have.not.been.called();
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be present in the request body");
            });
    });

    it("Should be able to interpret a failed request to POST /submissions to create a submission (missing property assignment_id)", () => {

        const postBody = {"name": testSubmission.getName()};
        
        var mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);});

        var mockCreateSubmission = chai.spy.on(
            testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission);});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(mockCreateSubmission).to.have.not.been.called();
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be present in the request body");
            });
    });

    it("Should be able to interpret a failed request to POST /submissions to create a submission (empty body)", () => {

        const postBody = {};
        
        var mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);});

        var mockCreateSubmission = chai.spy.on(
            testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission);});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(mockCreateSubmission).to.have.not.been.called();
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be present in the request body");
            });
    });

    //TODO: Fix. Technically only passing on the live app, has hardcoded hostname
    it("Should be able to interpret a request to POST /submissions/files to submit a file",() => {
        
        var mockGetSubmission = chai.spy.on(
            testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission)}
        );    

        //chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files").attach("submissionfile",fs.readFileSync("test/App.spec.ts"))
        superagent.post("http://localhost:8080/submissions/" + testSubmission.getId() + "/files").attach("submissionfile",fs.readFileSync("./test/App.spec.ts"))
         .then((res) => {
             expect(res).to.have.status(200);
             expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
             expect(res.body).to.have.property("response","File uploaded to submission successfully.");
         });
    });    

    //TODO: Add
    it.skip("Should be able to interpret a failedd request to POST /submissions/{id}/files with no file attached");
    it.skip("Should be able to interpret a failed request to POST /submissions/{id}/files with the incorrect file key");

    it("Should be able to interpret a request to GET /submissions/ofAssignment/{id} to get all submissions for the specified assignment if {id} is valid", () => {
        const expectedSubs = {submissions: [testSubmission.asJSON()]};

    
        testAssignment.addSubmission(testSubmission.getId());

        chai.spy.on(
            testAssignmentManager,'getAssignment',() => {return Promise.resolve(testAssignment);}
        )

        var mockGetSubmissions = chai.spy.on(
            testSubmissionManager, 'getSubmissions', () => {return Promise.resolve([testSubmission]);}
        );

        chai.request(testServer).get("/submissions/ofAssignment/"+testAssignment.getID())
            .then(res => {
                expect(res).to.have.status(200);
                expect(mockGetSubmissions).to.have.been.called.with(testAssignment.getID());
                expect(res.body).to.deep.equal(expectedSubs);
            });
    });
    it("Should be able to interpret a request to GET /submissions/ofAssignment/{id} to get all submissions for the specified assignment if {id} is invalid", () => {
        chai.spy.on(
            testAssignmentManager,'getAssignment',() => {return Promise.reject(new Error("The requested assignment does not exist"));}
        )
        chai.request(testServer).get("/submissions/ofAssignment/test")
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            });
    });
    it("Should be able to interpret a request to GET /submissions/ofAssignment/{id} to get all submissions for the specified assignment if the assignment has no submissions", () => {
        
        const mockAssignment = new Assignment("QQ29", "PewPew");
        
        chai.spy.on(
            testAssignmentManager,'getAssignment',() => {return Promise.resolve(mockAssignment);}
        )
        var mockGetSubmissions = chai.spy.on(
            testSubmissionManager, 'getSubmissions', () => {return Promise.resolve([]);}
        );
        chai.request(testServer).get("/submissions/ofAssignment/test")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("submissions").with.lengthOf(0); //TODO: ?
            });
    });
    it("Should be able to interpret a request to GET /submissions/{id} where {id} is valid", () => {
        const expectedSub = testSubmission.asJSON();
        chai.spy.on(
            testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission)}
        );

        chai.request(testServer).get("/submissions/ID117")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal(expectedSub)
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
            testSubmissionManager, 'updateSubmission', () => {return Promise.reject(new Error("Submission ID not found: " + nonexistentId))}
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
                expect(res.body).to.have.property("response").which.equals("Deleted submission "+testSubmission.getId());
            });
    });
    it("Should be able to interpret a failed request to DELETE /submissions/{id} where {id} is invalid", () => { 
        const nonexistentId = "drphilbertmd"
        chai.spy.on(
            testSubmissionManager, 'deleteSubmission', () => {return Promise.reject(new Error("Submission ID not found: " + nonexistentId))}
        );
        chai.request(testServer).delete("/submissions/" + nonexistentId)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Submission ID not found: " + nonexistentId);
            });
    });
    it("Should be able to interpret a request to GET /submissions/compare/{submission_id_1}/{submission_id_2}", () => {
        const mockAnalysisResult = new AnalysisResult();
        mockAnalysisResult.addMatch(testAre1, testAre2);

        chai.spy.on(testSubmissionManager, 'compareSubmissions', () => {return Promise.resolve(mockAnalysisResult)});

        chai.request(testServer).get("/submissions/compare/" + testAre1.getSubmissionID() + "/" + testAre2.getSubmissionID())
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equals(mockAnalysisResult.asJSON());
            });
    });
    it("Should be able to interpret a failed request to GET /submissions/compare/{submission_id_1}/{submission_id_2} (1 does not exist)", () => {
        const nonexistentId = "BADID"
        chai.spy.on(testSubmissionManager, 'compareSubmissions', (submissionId: String) => {
            if (submissionId === nonexistentId) {
                return Promise.reject(new Error("Submission ID not found: " + nonexistentId))
            } else {
                return Promise.resolve(testSubmission);
            }            
        });
        chai.request(testServer).get("/submissions/compare/" + nonexistentId + "/" + testAre2.getSubmissionID())
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body.response).to.equal("Submission ID not found: " + nonexistentId);
            });
    });
    it("Should be able to interpret a failed request to GET /submissions/compare?a={submission_id_1}&b={submission_id_2} (2 does not exist)", () => {
        const nonexistentId = "WORSEID"
        chai.spy.on(
            testSubmissionManager, 'compareSubmissions', () => {return Promise.reject(new Error("Submission ID not found: " + nonexistentId))}
        );
        chai.request(testServer).get("/submissions/compare/" + testAre1.getSubmissionID() + "/" + nonexistentId)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body.response).to.equal("Submission ID not found: " + nonexistentId);
            });
    });
});