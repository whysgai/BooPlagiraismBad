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
import { Assignment, IAssignment } from "../src/model/Assignment";
import { AssignmentFactory } from '../src/model/AssignmentFactory';


describe('AssignmentRouter.ts',()=> {
    
    var testServer : any;
    var testRouter : IRouter;
    var testAssignmentMgr : IAssignmentManager;
    var testAssignmentDAO: IAssignmentDAO;

    before((done) => {

        let app = express();
        app.use(express.json());
        app.use(bodyParser.json());            
        chai.use(chaiHttp);
        chai.use(chaiSpies);

         testAssignmentDAO = new AssignmentDAO();
         testAssignmentMgr = new AssignmentManager(testAssignmentDAO);
         testRouter = new AssignmentRouter(app,"/assignments",testAssignmentMgr); 
         testServer = app.listen(8081);
                done();      
        
    });
    
    it('should say hi back when GET /helloworld is queried',() => {
        chai.request(testServer).get("/assignments/helloworld").then(res  => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("response","the world and the bpb-back assignment router say hi back!!");
        });
    });

    it("Should be able to interpret a request to POST /assignments to create an assignment");

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

        chai.request(testServer).get("/assignments").then(res  => {
            expect(res).to.have.status(200);
            console.log(res.body.assignments[1]);
            expect(res.body).to.have.property("assignments").that.deep.equals(expectedAssignments);
        });
    });

    it("Should be able to interpret a request to GET /assignments/{id} where {id} is valid");

    it("Should be able to interpret a failed request to GET /assignments/{id} where {id} is invalid");

    it("Should be able to interpret a request to PUT /assignments/{id} where {id} is valid");

    it("Should be able to interpret a failed request to PUT /assignments/{id} where {id} is invalid");

    it("Should be able to interpret a request to DELETE /assignments/{id} where {id} is valid");

    it("Should be able to interpret a failed request to DELETE /assignments/{id} where {id} is invalid");

});