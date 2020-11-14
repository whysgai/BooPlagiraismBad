import { expect } from "chai";
import bodyParser from "body-parser";
import AssignmentRouter from "../src/router/AssignmentRouter"
import express from "express";
import IRouter from "../src/router/IRouter";
import chai = require("chai");
import chaiHttp = require("chai-http");
import chaiSpies = require("chai-spies");
import { IAssignmentManager, AssignmentManager } from "../src/model/AssignmentManager";
import { AssignmentDAO, IAssignmentDAO } from "../src/model/AssignmentDAO";
import { Assignment } from "../src/model/Assignment";

describe('AssignmentRouter.ts',()=> {
    
    var app : express.Application;
    var testServer : any;
    var testRouter : IRouter;
    var testAssignmentMgr : IAssignmentManager;
    var testAssignmentDAO: IAssignmentDAO;

    before(() => {
        chai.use(chaiHttp);
        chai.use(chaiSpies);
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(bodyParser.json());      
        testAssignmentDAO = new AssignmentDAO();
        testAssignmentMgr = new AssignmentManager(testAssignmentDAO);
        testRouter = new AssignmentRouter(app,"/assignments",testAssignmentMgr); 
        testServer = app.listen(8081);
    });
    
    it("Should be able to interpret a request to POST /assignments to create an assignment",() => {
       
        const expectedId = "CHER"
        const expectedName = "test assignment"
        const mockAssignment = new Assignment(expectedId,expectedName);

        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})

        chai.request(testServer).post("/assignments/").send({"name":expectedName})
        .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("name").which.equals(expectedName);
            expect(res.body).to.have.property("_id").which.equals(expectedId);
        });
    });

    it("Should be able to interpret a failed request to POST /assignments to create an assignment if name is not defined",() => {
        
        const mockAssignment = new Assignment("test","test");

        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})

        chai.request(testServer).post("/assignments/").send({"name":undefined})
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("An assignment name was not provided");
        });
    });
    
    it("Should be able to interpret a failed request to POST /assignments to create an assignment if no name is provided",() => {
        
        const mockAssignment = new Assignment("test","test");

        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})

        chai.request(testServer).post("/assignments/").send({})
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("An assignment name was not provided");
        });
    });
    it("Should be able to interpret a request to GET /assignments to get all assignments", () => {
        
        const firstMockAssignment = new Assignment('007', 'BondJamesBond');
        const secondMockAssignment = new Assignment('008', 'SonOfJamesBond');

        secondMockAssignment.addSubmission("secret_mission");
        secondMockAssignment.addSubmission("where_eagles_dare");

        const expectedAssignments = [
                                        {"_id":"007","name":"BondJamesBond","submissionIds":[]},
                                        {"_id":"008","name":"SonOfJamesBond","submissionIds":["secret_mission","where_eagles_dare"]}
                                    ]

        chai.spy.on(testAssignmentMgr,'getAssignments',() =>{return Promise.resolve([firstMockAssignment,secondMockAssignment])});

        chai.request(testServer).get("/assignments")
        .then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("assignments").that.deep.equals(expectedAssignments);
        });
    });

    it("Should be able to interpret a request to GET /assignments/{id} where {id} is valid",() => {

        const expectedId = '009'
        const mockAssignment = new Assignment(expectedId, 'Hercules Jones');
        const mockMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.resolve(mockAssignment)});

        chai.request(testServer).get("/assignments/"+expectedId)
        .then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("_id").which.equals(expectedId);
            expect(mockMethod).to.have.been.called.with(expectedId);
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

    it("Should be able to interpret a request to PUT /assignments/{id} where {id} is valid");

    it("Should be able to interpret a failed request to PUT /assignments/{id} where {id} is invalid");

    it("Should be able to interpret a request to DELETE /assignments/{id} where {id} is valid");

    it("Should be able to interpret a failed request to DELETE /assignments/{id} where {id} is invalid");

});