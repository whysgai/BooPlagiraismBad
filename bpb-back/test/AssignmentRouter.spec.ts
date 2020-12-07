import { expect } from "chai";
import AssignmentRouter from "../src/router/AssignmentRouter"
import express from "express";
import fileUpload from 'express-fileupload'
import IRouter from "../src/router/IRouter";
import chai = require("chai");
import chaiHttp = require("chai-http");
import chaiSpies = require("chai-spies");
import { IAssignmentManager, AssignmentManager } from "../src/manager/AssignmentManager";
import { Assignment, IAssignment } from "../src/model/Assignment";
import { ISubmissionManager, SubmissionManager } from "../src/manager/SubmissionManager";

describe('AssignmentRouter.ts',()=> {
    
    let app : express.Application;
    let testServer : any;
    let testRouter : IRouter;
    let testAssignmentMgr : IAssignmentManager;
    let testSubmissionMgr : ISubmissionManager;

    let expectedName: string;
    let mockAssignment: IAssignment;


    before(() => {
        chai.use(chaiHttp);
        chai.use(chaiSpies);
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(fileUpload());      
        testAssignmentMgr = AssignmentManager.getInstance();
        testSubmissionMgr = SubmissionManager.getInstance();
        testAssignmentMgr.invalidateCaches();
        testSubmissionMgr.invalidateCaches();
        chai.spy.restore();
        
        
        testRouter = new AssignmentRouter(app,"/assignments",testSubmissionMgr,testAssignmentMgr); 
        testServer = app.listen(8081);

        expectedName = "CHER"
        const assignmentBuilder = new Assignment.builder();
        assignmentBuilder.setName(expectedName);
        mockAssignment = assignmentBuilder.build();
    });

    afterEach(() => {
        testServer.close();
    });
    
    it("Should be able to interpret a request to POST /assignments to create an assignment",() => {    

        const postBody = {"name":expectedName};

        let mockCreateAssignment = chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})
        
        let expectedPostBody = {"name":expectedName}
        
        chai.request(testServer).post("/assignments/")
        .send(postBody)
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockCreateAssignment).to.have.been.called.with(expectedPostBody);
            expect(res.body).to.have.property("name").which.equals(expectedName);
        });
    });

    it("Should be able to interpret a failed request to POST /assignments to create an assignment if name is not defined",() => {
        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})

        chai.request(testServer).post("/assignments/").send({"name":undefined})
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("An assignment name was not provided");
        });
    });
    
    it("Should be able to interpret a failed request to POST /assignments to create an assignment if no name is provided",() => {

        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})

        chai.request(testServer).post("/assignments/").send({})
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("An assignment name was not provided");
        });
    });
    
    it('Should be able to interpret a failed request to POST /assignments/ if manager fails to create submission',() => {

        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.reject(new Error("Failed to create submission"))})
        
        const expectedName = "test assignment"
        const postBody = {"name":expectedName};

        chai.request(testServer).post("/assignments/")
        .send(postBody)
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("Failed to create submission");
        });
    });
    
    it("Should be able to interpret a request to GET /assignments to get all assignments", () => {
        
        const assignmentBuilder1 = new Assignment.builder();
        assignmentBuilder1.setName('BondJamesBond');
        const firstMockAssignment = assignmentBuilder1.build();

        const assignmentBuilder2 = new Assignment.builder();
        assignmentBuilder2.setName('SonOfJamesBond');
        const secondMockAssignment = assignmentBuilder2.build();


        const expectedAssignments = [
            firstMockAssignment.asJSON(),
            secondMockAssignment.asJSON()
                                    ]

        chai.spy.on(testAssignmentMgr,'getAssignments',() =>{return Promise.resolve([firstMockAssignment,secondMockAssignment])});

        chai.request(testServer).get("/assignments")
        .then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("assignments").that.deep.equals(expectedAssignments);
        });
    });

    it("Should be able to interpret a failed request to GET /assignments to get all assignments if manager.getAssignments fails", () => {
        
        chai.spy.on(testAssignmentMgr,'getAssignments',() =>{return Promise.reject(new Error("Failed to get assignments"))});

        chai.request(testServer).get("/assignments")
        .then(res  => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("Failed to get assignments");
        });
    });

    it("Should be able to interpret a request to GET /assignments/{id} where {id} is valid",() => {

        const mockMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.resolve(mockAssignment)});

        chai.request(testServer).get("/assignments/" + mockAssignment.getId())
        .then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("name").which.equals(mockAssignment.getName());
            expect(mockMethod).to.have.been.called.with(mockAssignment.getId());
        });
    });

    it("Should be able to interpret a failed request to GET /assignments/{id} where {id} is invalid",() => {

        const expectedId = '0010'
        const mockMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});

        chai.request(testServer).get("/assignments/"+expectedId)
        .then(res  => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            expect(mockMethod).to.have.been.called.with(expectedId);
        });
    });

    it("Should be able to interpret a request to PUT /assignments/{id} where {id} is valid",() => {
       
        const expectedName2 = "Dr. Wilhelm Falp's Assignment of Agony"
        const assignmentBuilder2 = new Assignment.builder();
        assignmentBuilder2.setName(expectedName2);
        const mockAssignment2 = assignmentBuilder2.build();

        const putBody = {"name":expectedName}

        chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment2)});
        let mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.resolve(mockAssignment2)});
 
        chai.request(testServer).put("/assignments/" + mockAssignment2.getId())
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockUpdateMethod).to.have.been.called.with(mockAssignment2.getId(), putBody);
        })
    });
    
    it("Should be able to interpret a failed request to PUT /assignments/{id} where {id} is invalid",() => {
        const expectedId = '0077'
        const expectedName = "Jims Bonde"
        const putBody = {"name":expectedName}

        chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
        let mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
 
        chai.request(testServer).put("/assignments/"+expectedId)
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            expect(mockUpdateMethod).not.to.have.been.called;
        })
    });

    it('Should be able to interpret a failed request to PUT /assignments/{id} if request body does not include all expected properties',() => {

        chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        let mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.resolve(mockAssignment)});
 
        chai.request(testServer).put("/assignments/" + mockAssignment.getId())
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("A request body was not provided, or the provided request body is missing name property");
            expect(mockUpdateMethod).not.to.have.been.called;
        })
    });

    it("Should be able to interpret a failed request to PUT /assignments/{id} if manager.updateAssignment fails",() => {

        const putBody = {"name":expectedName}

        chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        let mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.reject(new Error("Update failed"))});
 
        chai.request(testServer).put("/assignments/" + mockAssignment.getId())
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(400);
            expect(mockUpdateMethod).to.have.been.called.with(mockAssignment.getId(), putBody);
            expect(res.body).to.have.property("response").which.equals("Update failed");
        })
    });

    it("Should be able to interpret a request to DELETE /assignments/{id} where {id} is valid",() => {

        chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        let mockDeleteMethod = chai.spy.on(testAssignmentMgr,'deleteAssignment',() =>{return Promise.resolve()});
 
        chai.request(testServer).delete("/assignments/"+mockAssignment.getId())
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockDeleteMethod).to.have.been.called.with(mockAssignment.getId());
            expect(res.body.response).to.equal("Deleted assignment "+mockAssignment.getId());
        })
    });

    it("Should be able to interpret a failed request to DELETE /assignments/{id} where {id} is invalid",() => {

        chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
        let mockDeleteMethod = chai.spy.on(testAssignmentMgr,'deleteAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
 
        chai.request(testServer).delete("/assignments/" + mockAssignment.getId())
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            expect(mockDeleteMethod).not.to.have.been.called;
        })
    });

    it("Should be able to interpret a failed request to DELETE /assignments/{id} where manager.deleteAssignment fails",() => {

        chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        let mockDeleteMethod = chai.spy.on(testAssignmentMgr,'deleteAssignment',() =>{return Promise.reject(new Error("Delete failed"))});
 
        chai.request(testServer).delete("/assignments/"+mockAssignment.getId())
        .then(res => {
            expect(res).to.have.status(400);
            expect(mockDeleteMethod).to.have.been.called.with(mockAssignment.getId());
            expect(res.body).to.have.property("response").which.equals("Delete failed");
        });
    });
});