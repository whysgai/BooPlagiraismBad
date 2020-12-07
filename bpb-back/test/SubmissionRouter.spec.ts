import { expect } from "chai";
import SubmissionRouter from "../src/router/SubmissionRouter"
import express from "express";
import IRouter from "../src/router/IRouter";
import fs from 'fs';
import util from 'util';
import chai = require("chai");
import chaiHttp = require("chai-http");
import chaiSpies = require("chai-spies");
import { ISubmissionManager, SubmissionManager } from "../src/manager/SubmissionManager";
import { Submission, ISubmission } from "../src/model/Submission";
import { AnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { AnalysisResult } from "../src/model/AnalysisResult";
import { Assignment, IAssignment } from "../src/model/Assignment";
import { IAssignmentManager, AssignmentManager } from "../src/manager/AssignmentManager";
import { AnalysisResultEntryCollectorVisitor } from "../src/model/AnalysisResultEntryCollectorVisitor";
import fileUpload = require("express-fileupload");
import { AppConfig } from '../src/AppConfig';
const readFileContent = util.promisify(fs.readFile);

//Note: these tests depend on environment variables set in scripts/test_* (MAXFILEUPLOADSIZE)
describe('SubmissionRouter.ts',()=> {

    let app : express.Application;
    let testServer : any;
    let testRouter : IRouter;
    let testSubmissionManager : ISubmissionManager;
    let testAssignmentManager : IAssignmentManager;
    let testSubmission : ISubmission;
    let testAssignment : IAssignment;
    let testAre1 : AnalysisResultEntry;
    let testAre2 : AnalysisResultEntry;
    let count : number;

    before(() => {
        chai.use(chaiHttp);
        chai.use(chaiSpies);
        count = 0;
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(fileUpload());

        testAssignmentManager = AssignmentManager.getInstance();
        testSubmissionManager = SubmissionManager.getInstance();
        testAssignmentManager.invalidateCaches();
        testSubmissionManager.invalidateCaches();
        chai.spy.restore();

        testAssignment = new Assignment.builder().build();

        let builder = new Submission.builder();
        builder.setAssignmentId(testAssignment.getId());
        builder.setName("test");
        testSubmission = builder.build();

        testAre1 = new AnalysisResultEntry("ID117",testSubmission.getId(),"test.java","method",1,3,7,9,"245rr1","void test(Itaque quod qui autem natus illum est. Ab voluptate consequuntur nulla. Molestias odio ex dolorem cumque non ad ullam. Quo nihil voluptatem explicabo voluptas. Et facere odio rem dolores rerum eos minima quos.) { }");
        testAre2 = new AnalysisResultEntry("ID666","some_other_submission_id","testing.java","method",2,4,6,8,"245rr1","void test(Itaque quod qui autem natus illum est. Ab voluptate consequuntur nulla. Molestias odio ex dolorem cumque non ad ullam. Quo nihil voluptatem explicabo voluptas. Et facere odio rem dolores rerum eos minima quos.) { }");
        testSubmission.addAnalysisResultEntry(testAre1);
        testSubmission.addAnalysisResultEntry(testAre2);
        
        testServer = app.listen(8081);      
    });

    afterEach(() => {
        testServer.close();
    });

    it("Should be able to interpret a request to POST /submissions to create a submission", () => {
        
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const postBody = {"name": testSubmission.getName(), "assignment_id": testAssignment.getId()};
        
        let mockARECollector = chai.spy.on(AnalysisResultEntryCollectorVisitor, 'getAnalysisResultEntries', () => { return [testAre1, testAre2]})

        let mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);}
        )
        chai.spy.on(testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission)});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(200);
                expect(mockGetAssignment).to.have.been.called.with(testAssignment.getId());
                expect(res.body).to.deep.equals(testSubmission.asJSON());
            });
    });
    it("Should be able to interpret a failed request to POST /submissions to create a submission (invalid assignment id)", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const postBody = {"name": testSubmission.getName(), "assignment_id": testAssignment.getId()};
        
        let mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.reject(new Error("The requested assignment does not exist"));}
        )
        let mockCreateSubmission = chai.spy.on(testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission)});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(mockGetAssignment).to.have.been.called.with(testAssignment.getId());
                expect(mockCreateSubmission).to.have.not.been.called();
                expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            });
    });

    it("Should be able to interpret a failed request to POST /submissions to create a submission (missing property name)", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const postBody = {"assignment_id": testAssignment.getId()};
        
        let mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);});

        let mockCreateSubmission = chai.spy.on(
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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const postBody = {"name": testSubmission.getName()};
        
        let mockGetAssignment = chai.spy.on(
            testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);});

        let mockCreateSubmission = chai.spy.on(
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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const postBody = {};
        
        chai.spy.on(testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);});

        let mockCreateSubmission = chai.spy.on(
            testSubmissionManager, 'createSubmission', () => {return Promise.resolve(testSubmission);});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(mockCreateSubmission).to.have.not.been.called();
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be present in the request body");
            });
    });

    it("Should be able to interpret a failed request to POST /submissions if manager.createSubmission fails",() => {
        
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const postBody = {"name": testSubmission.getName(), "assignment_id": testAssignment.getId()};

        chai.spy.on(testAssignmentManager, 'getAssignment', () => {return Promise.resolve(testAssignment);})

        chai.spy.on(testSubmissionManager, 'createSubmission', () => {return Promise.reject(new Error("Failed to create submission"))});

        chai.request(testServer).post("/submissions")
            .send(postBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Failed to create submission");
            });
    });

    it("Should be able to interpret a request to POST /submissions/files to submit a file",async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);
        const sampleFilePath = "test/res/javaExample.java";
        const sampleFileContent = await readFileContent(sampleFilePath);
        const sampleFileName = 'javaExample.java';

        let mockGetSubmission = chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission);});
        let mockProcessSubmissionFile = chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.resolve();});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .attach("submissionFile", sampleFileContent, sampleFileName)
            .then((res) => {
                expect(res.body).to.have.property("response", "File " + sampleFileName + " uploaded to submission successfully.");
                expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
                expect(mockProcessSubmissionFile).to.have.been.called.with(testSubmission.getId()); 
                expect(mockProcessSubmissionFile).to.have.been.called.with(sampleFileName);
                expect(res).to.have.status(200);
        });
    });

    it("Should be able to interpret a request to POST /submissions/files to submit a file (even if submission directory exists)",async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);
        const sampleFilePath = "test/res/javaExample.java";
        const sampleFileContent = await readFileContent(sampleFilePath);
        const sampleFileName = 'javaExample.java';
        const sampleFilePath2 = "test/res/javaExample2.java";
        const sampleFileContent2 = await readFileContent(sampleFilePath2);
        const sampleFileName2 = "javaExample2.java";

        let mockGetSubmission = chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission);});
        let mockProcessSubmissionFile = chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.resolve();});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
        .attach("submissionFile", sampleFileContent, sampleFileName)
        .then((res) => {
            expect(res.body).to.have.property("response", "File " + sampleFileName + " uploaded to submission successfully.");
            expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
            expect(mockProcessSubmissionFile).to.have.been.called.with(testSubmission.getId()); 
            expect(mockProcessSubmissionFile).to.have.been.called.with(sampleFileName);
            expect(res).to.have.status(200);

            return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .attach("submissionFile", sampleFileContent2, sampleFileName2)
            .then((res) => {
                expect(res.body).to.have.property("response", "File " + sampleFileName2 + " uploaded to submission successfully.");
                expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
                expect(mockProcessSubmissionFile).to.have.been.called.with(testSubmission.getId()); 
                expect(mockProcessSubmissionFile).to.have.been.called.with(sampleFileName2);
                expect(res).to.have.status(200);
            });
        });
    });

    it("Should be able to interpret a failed request to POST /submissions/{id}/files with no file attached", async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);

        chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission);});
        chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.resolve();});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .then((res) => {
                expect(res.body).to.have.property("response", "No file was included in this request. Please ensure a file is provided.");
                expect(res).to.have.status(400);
        });
    });
    it("Should be able to interpret a failed request to POST /submissions/{id}/files with the incorrect file key", async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);
        const sampleFilePath = "test/res/javaExample.java";
        const sampleFileContent = await readFileContent(sampleFilePath);
        const sampleFileName = 'javaExample.java';

        chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission);});
        chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.resolve();});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .attach("badKeyName", sampleFileContent, sampleFileName)
            .then((res) => {
                expect(res.body).to.have.property("response").which.equals("File was not submitted using the key name submissionFile. Please resend the file using that key (case sensitive)");
                expect(res).to.have.status(400);
        });
    });

    it("Should be able to interpret a failed request to POST /submissions/{id}/files if the file is too large", async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);
        const sampleFilePath = "test/res/largeJavaExample.java";
        const sampleFileContent = await readFileContent(sampleFilePath);
        const sampleFileName = 'largeJavaExample.java';

        chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission);});
        chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.resolve();});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .attach("submissionFile", sampleFileContent, sampleFileName)
            .then((res) => {
                expect(res.body).to.have.property("response").which.equals("The file specified for upload is too large. The maximum individual file size is " + AppConfig.maxFileUploadSize());
                expect(res).to.have.status(400);
        });
    });

    it("Should be able to interpret a failed request to POST /submissions/{id}/files if getSubmission fails", async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);
        const sampleFilePath = "test/res/javaExample.java";
        const sampleFileContent = await readFileContent(sampleFilePath);
        const sampleFileName = 'javaExample.java';

        chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.reject(new Error("getSubmission failed"));});
        chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.resolve();});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .attach("submissionFile", sampleFileContent, sampleFileName)
            .then((res) => {
                expect(res.body).to.have.property("response").which.equals("getSubmission failed");
                expect(res).to.have.status(400);
        });
    });

    it("Should be able to interpret a failed request to POST /submissions/{id}/files if processSubmissionFile fails", async () => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager);
        const sampleFilePath = "test/res/javaExample.java";
        const sampleFileContent = await readFileContent(sampleFilePath);
        const sampleFileName = 'javaExample.java';

        chai.spy.on(testSubmissionManager, 'getSubmission', () => {return Promise.resolve(testSubmission);});
        chai.spy.on(testSubmissionManager, 'processSubmissionFile', () => {return Promise.reject(new Error("processSubmission failed"));});    

        return chai.request(testServer).post("/submissions/" + testSubmission.getId() + "/files")
            .attach("submissionFile", sampleFileContent, sampleFileName)
            .then((res) => {
                expect(res.body).to.have.property("response").which.equals("processSubmission failed");
                expect(res).to.have.status(400);
        });
    });
    
    it("Should be able to interpret a request to GET /submissions/ofAssignment/{id} to get all submissions for the specified assignment if {id} is valid", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const expectedSubs = {submissionIds: [testSubmission.getId()]};

    
        chai.spy.on(
            testAssignmentManager,'getAssignment',() => {return Promise.resolve(testAssignment);}
        )

        let mockGetSubmissions = chai.spy.on(
            testSubmissionManager, 'getSubmissions', () => {return Promise.resolve([testSubmission]);}
        );

        chai.request(testServer).get("/submissions/ofAssignment/"+testAssignment.getId())
            .then(res => {
                expect(res).to.have.status(200);
                expect(mockGetSubmissions).to.have.been.called.with(testAssignment.getId());
                expect(res.body).to.deep.equal(expectedSubs);
            });
    });
    it("Should be able to interpret a request to GET /submissions/ofAssignment/{id} to get all submissions for the specified assignment if {id} is invalid", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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
        
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const mockAssignment = new Assignment.builder().build();
        
        chai.spy.on(
            testAssignmentManager,'getAssignment',() => {return Promise.resolve(mockAssignment);}
        )
        let mockGetSubmissions = chai.spy.on(
            testSubmissionManager, 'getSubmissions', () => {return Promise.resolve([]);}
        );
        chai.request(testServer).get("/submissions/ofAssignment/test")
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("submissionIds").with.lengthOf(0); //TODO: ?
            });
    });

    it("Should be able to interpret a failed request to GET /submissions/ofAssignment/{id} if AssignmentManager fails to getAssignment", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const expectedSubs = {submissions: [testSubmission.asJSON()]};

    
        chai.spy.on(testAssignmentManager,'getAssignment',() => {return Promise.reject(new Error("Failed to find assignment"));})

        chai.spy.on(testSubmissionManager, 'getSubmissions', () => {return Promise.resolve([testSubmission]);});

        chai.request(testServer).get("/submissions/ofAssignment/" + testAssignment.getId())
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Failed to find assignment");
            });
    });

    it("Should be able to interpret a failed request to GET /submissions/ofAssignment/{id} if SubmissionManager fails to getSubmissions", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const expectedSubs = {submissions: [testSubmission.asJSON()]};

    
        chai.spy.on(testAssignmentManager,'getAssignment',() => {return Promise.resolve(testAssignment);})

        chai.spy.on(testSubmissionManager, 'getSubmissions', () => {return Promise.reject(new Error("Failed to get submissions"));});

        chai.request(testServer).get("/submissions/ofAssignment/"+testAssignment.getId())
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("Failed to get submissions");
            });
    });

    it("Should be able to interpret a request to GET /submissions/{id} where {id} is valid", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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
    it("Should be able to interpret a failed request to PUT /submissions/{id} where name body property is missing", () => { 
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const nonexistentId = "drphilbertmd"
        const putBody = {assignment_id:"testy"};
        chai.spy.on(
            testSubmissionManager, 'updateSubmission', () => {return Promise.resolve(undefined)}
        );
        chai.request(testServer).put("/submissions/" + nonexistentId)
            .send(putBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be defined on the request body");
            });
    });
    it("Should be able to interpret a failed request to PUT /submissions/{id} where assignment_id body property is missing", () => { 
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const nonexistentId = "drphilbertmd"
        const putBody = {name:"testy"};
        chai.spy.on(
            testSubmissionManager, 'updateSubmission', () => {return Promise.resolve(undefined)}
        );
        chai.request(testServer).put("/submissions/" + nonexistentId)
            .send(putBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be defined on the request body");
            });
    });
    it("Should be able to interpret a failed request to PUT /submissions/{id} where both body properties are missing", () => { 
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        
        chai.spy.on(
            testSubmissionManager, 'updateSubmission', () => {return Promise.resolve(undefined)}
        );
        const nonexistentId = "drphilbertmd"
        const putBody = {};
        chai.request(testServer).put("/submissions/" + nonexistentId)
            .send(putBody)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property("response").which.equals("name and assignment_id properties must both be defined on the request body");
            });
    });
    it("Should be able to interpret a request to DELETE /submissions/{id} where {id} is valid", () => { 

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        chai.spy.on(testSubmissionManager, 'deleteSubmission', () => {return Promise.resolve(testSubmission)});
        chai.request(testServer).delete("/submissions/" + testSubmission.getId())
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("response").which.equals("Deleted submission "+testSubmission.getId());
            });
    });
    it("Should be able to interpret a failed request to DELETE /submissions/{id} where {id} is invalid", () => { 

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const mockAnalysisResult = new AnalysisResult([[testAre1, testAre2]], 5, testAre1.getSubmissionID(), 
        testAre2.getSubmissionID(), testAre1.getFileName(), testAre2.getFileName());
        let mockAnalysisResultArray = new Array<AnalysisResult>();
        mockAnalysisResultArray.push(mockAnalysisResult);

        chai.spy.on(testSubmissionManager, 'compareSubmissions', () => {return Promise.resolve(mockAnalysisResultArray)});

        chai.request(testServer).get("/submissions/compare/" + testAre1.getSubmissionID() + "/" + testAre2.getSubmissionID())
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equals(mockAnalysisResultArray.map((result) => result.asJSON()));
            });
    });
    it("Should be able to interpret a failed request to GET /submissions/compare/{submission_id_1}/{submission_id_2} (1 does not exist)", () => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

        const nonexistentId = "BADID"
        chai.spy.on(testSubmissionManager, 'compareSubmissions', (submissionId: string) => {
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

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 

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

    it("Should be able to interpret a request to GET /submissions/{id}/files/{index} to return the contents of a submission file",() => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        const testContent = "thisissometestfilecontent";

        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.resolve(testSubmission)});
        chai.spy.on(testSubmissionManager,"getSubmissionFileContent",() => { return Promise.resolve(testContent)});

        return chai.request(testServer).get("/submissions/" + testSubmission.getId() + "/files/0").then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("content").which.deep.equals(testContent);
        });
    });

    it("Should be able to interpret a failed request to GET /submissions/{id}/files/{index} if index provided is not a number",() => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        const testContent = "thisissometestfilecontent";

        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.resolve(testSubmission)});
        chai.spy.on(testSubmissionManager,"getSubmissionFileContent",() => { return Promise.resolve(testContent)});

        return chai.request(testServer).get("/submissions/" + testSubmission.getId() + "/files/test").then((res) => {
            expect(res).to.have.status(404);
        });
    });

    it("Should be able to interpret a failed request to GET /submissions/{id}/files/{index} if the submission has no files",() => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        let mockSubmission = new Submission.builder().build();

        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.resolve(mockSubmission)});

        return chai.request(testServer).get("/submissions/" + mockSubmission.getId() + "/files/0").then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The specified submission has no files");
        });
    });

    it("Should be able to interpret a failed request to GET /submissions/{id}/files/{index} if an invalid index (1 ... n) is specified (right bound)",() => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        const testContent = "thisissometestfilecontent";

        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.resolve(testSubmission)});
        chai.spy.on(testSubmissionManager,"getSubmissionFileContent",() => { return Promise.resolve(testContent)});

        return chai.request(testServer).get("/submissions/" + testSubmission.getId() + "/files/9").then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The provided file index is out of bounds");
        });
    });

    it("Should be able to interpret a failed request to GET /submissions/{id}/files/{index} if an invalid index (1 ... n) is specified (left bound)",() => {
        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        const testContent = "thisissometestfilecontent";

        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.resolve(testSubmission)});
        chai.spy.on(testSubmissionManager,"getSubmissionFileContent",() => { return Promise.resolve(testContent)});

        return chai.request(testServer).get("/submissions/" + testSubmission.getId() + "/files/-1").then((res) => {
            expect(res).to.have.status(404); //Negative integers should fail regex check
        });
    });

    it("Should be able to interpret a failed request to GET /submissions/{id}/files/{index} if getSubmission fails and the specified submission does not exist",() => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.reject(new Error("The specified submission does not exist"))});
        chai.spy.on(testSubmissionManager,"getSubmissionFileContent",() => { return Promise.resolve("test")});

        return chai.request(testServer).get("/submissions/" + testSubmission.getId() + "/files/1").then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The specified submission does not exist");
        });
    });

    it("Should be able to interpret a failed request to GET /submissions/{id}/files/{index} if getSubmissionFileContent fails (bad content, not a text file, or nonexistent file)",() => {

        testRouter = new SubmissionRouter(app,"/submissions",testSubmissionManager,testAssignmentManager); 
        chai.spy.on(testSubmissionManager,"getSubmission",() => { return Promise.resolve(testSubmission)});
        chai.spy.on(testSubmissionManager,"getSubmissionFileContent",() => { return Promise.reject(new Error("Cannot process the specified file. It may not exist on the server filesystem or may not contain text"))});

        return chai.request(testServer).get("/submissions/" + testSubmission.getId() + "/files/1").then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("Cannot process the specified file. It may not exist on the server filesystem or may not contain text");
        });
    });
});