import { expect } from "chai";
import bodyParser from "body-parser";
import AssignmentRouter from "../src/router/AssignmentRouter"
import express from "express";
import IRouter from "../src/router/IRouter";
import chai = require("chai");
import chaiHttp = require("chai-http");
import chaiSpies = require("chai-spies");
import { IAssignmentManager, AssignmentManager } from "../src/manager/AssignmentManager";
import { IAssignmentDAO, AssignmentDAO } from "../src/model/AssignmentDAO";
import { Assignment } from "../src/model/Assignment";
import { ISubmissionManager, SubmissionManager } from "../src/manager/SubmissionManager";

describe('AssignmentRouter.ts',()=> {
    
    var app : express.Application;
    var testServer : any;
    var testRouter : IRouter;
    var testAssignmentMgr : IAssignmentManager;
    var testAssignmentDAO : IAssignmentDAO;
    var testSubmissionMgr : ISubmissionManager;

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
        testSubmissionMgr = new SubmissionManager();
        testRouter = new AssignmentRouter(app,"/assignments",testSubmissionMgr,testAssignmentMgr); 
        testServer = app.listen(8081);
    });
    
    it("Should be able to interpret a request to POST /assignments to create an assignment",() => {
       
        const expectedId = "CHER"
        const expectedName = "test assignment"
        const mockAssignment = new Assignment(expectedId,expectedName);
        const postBody = {"name":expectedName};

        chai.spy.on(testAssignmentMgr,'createAssignment',() => {return Promise.resolve(mockAssignment)})

        chai.request(testServer).post("/assignments/")
        .send(postBody)
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

    //TODO: Add later
    it('Should be able to interpret a failed request to POST /assignments/ if any specified submission IDs do not exist');
    
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

    it("Should be able to interpret a failed request to GET /assignments to get all assignments if manager.getAssignments fails", () => {
        
        chai.spy.on(testAssignmentMgr,'getAssignments',() =>{return Promise.reject(new Error("Failed to get assignments"))});

        chai.request(testServer).get("/assignments")
        .then(res  => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("Failed to get assignments");
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

    it("Should be able to interpret a request to PUT /assignments/{id} where {id} is valid",() => {
       
        const expectedId = '0010'
        const expectedName = "Dr. Wilhelm Falp's Assignment of Agony"
        const mockAssignment = new Assignment(expectedId,expectedName);
        const putBody = {"name":expectedName,"submissions":["test1","test2"]}

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.resolve(mockAssignment)});
 
        chai.request(testServer).put("/assignments/" + expectedId)
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockGetMethod).to.have.been.called.with(mockAssignment.getID());
            expect(mockUpdateMethod).to.have.been.called.with(mockAssignment, putBody);
        })
    });

    it("Should be able to interpret a request to PUT /assignments/{id} where {id} is valid (name property only)",() => {
       
        const expectedId = '01'
        const expectedName = "Traveling Salesmen"
        const mockAssignment = new Assignment(expectedId,expectedName);
        const putBody = {"name":expectedName}

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.resolve(mockAssignment)});
 
        chai.request(testServer).put("/assignments/"+expectedId)
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockGetMethod).to.have.been.called.with(mockAssignment.getID());
            expect(mockUpdateMethod).to.have.been.called.with(mockAssignment,putBody);
        })
    });

    it("Should be able to interpret a request to PUT /assignments/{id} where {id} is valid (submissions property only)",() => {
       
        const expectedId = '0009'
        const expectedName = "Example!"
        const mockAssignment = new Assignment(expectedId,expectedName);
        const putBody = {"submissions":["test1","test2"]}

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.resolve(mockAssignment)});
 
        chai.request(testServer).put("/assignments/"+expectedId)
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockGetMethod).to.have.been.called.with(mockAssignment.getID());
            expect(mockUpdateMethod).to.have.been.called.with(mockAssignment,putBody);
        })
    });
    
    it("Should be able to interpret a failed request to PUT /assignments/{id} where {id} is invalid",() => {
        const expectedId = '0077'
        const expectedName = "Jims Bonde"
        const putBody = {"name":expectedName,"submissions":["test21"]}

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
        var mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
 
        chai.request(testServer).put("/assignments/"+expectedId)
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            expect(mockGetMethod).to.have.been.called.with(expectedId);
            expect(mockUpdateMethod).not.to.have.been.called;
        })
    });

    it('Should be able to interpret a failed request to PUT /assignments/{id} if request body does not include at least one expected property',() => {
        const expectedId = "2233";
        const expectedName = "Dr. Jones and the Technicolor Code Coverage Report";
        const mockAssignment = new Assignment(expectedId,expectedName);

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.resolve(mockAssignment)});
 
        chai.request(testServer).put("/assignments/"+expectedId)
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("A request body was not provided, or the provided request body is missing both name and submissions properties");
            expect(mockGetMethod).to.not.have.been.called;
            expect(mockUpdateMethod).not.to.have.been.called;
        })
    });

    it("Should be able to interpret a failed request to PUT /assignments/{id} if manager.updateAssignment fails",() => {
       
        const expectedId = "999";
        const expectedName = "Felicia's Static Code Analysis Mission #3";
        const mockAssignment = new Assignment(expectedId,expectedName);
        const putBody = {"name":expectedName,"submissions":["test1","test2"]}

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockUpdateMethod = chai.spy.on(testAssignmentMgr,'updateAssignment',() =>{return Promise.reject(new Error("Update failed"))});
 
        chai.request(testServer).put("/assignments/" + expectedId)
        .send(putBody)
        .then(res => {
            expect(res).to.have.status(400);
            expect(mockGetMethod).to.have.been.called.with(mockAssignment.getID());
            expect(mockUpdateMethod).to.have.been.called.with(mockAssignment, putBody);
            expect(res.body).to.have.property("response").which.equals("Update failed");
        })
    });

    it("Should be able to interpret a request to DELETE /assignments/{id} where {id} is valid",() => {
       
        const expectedId = '89890'
        const expectedName = "Assignment Name"
        const mockAssignment = new Assignment(expectedId,expectedName);

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockDeleteMethod = chai.spy.on(testAssignmentMgr,'deleteAssignment',() =>{return Promise.resolve()});
 
        chai.request(testServer).delete("/assignments/"+expectedId)
        .then(res => {
            expect(res).to.have.status(200);
            expect(mockGetMethod).to.have.been.called.with(expectedId);
            expect(mockDeleteMethod).to.have.been.called.with(mockAssignment.getID());
            expect(res.body.response).to.equal("Deleted assignment "+expectedId);
        })
    });

    it("Should be able to interpret a failed request to DELETE /assignments/{id} where {id} is invalid",() => {
        const expectedId = 'ewtr12'

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
        var mockDeleteMethod = chai.spy.on(testAssignmentMgr,'deleteAssignment',() =>{return Promise.reject(new Error("The requested assignment does not exist"))});
 
        chai.request(testServer).delete("/assignments/"+expectedId)
        .then(res => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("response").which.equals("The requested assignment does not exist");
            expect(mockGetMethod).to.have.been.called.once;
            expect(mockDeleteMethod).not.to.have.been.called;
        })
    });

    it("Should be able to interpret a failed request to DELETE /assignments/{id} where manager.deleteAssignment fails",() => {
       
        const expectedId = '89890'
        const expectedName = "Tabitha and the Seventh Level of the Recursive CS6999 Escher World Test Exercise";
        const mockAssignment = new Assignment(expectedId,expectedName);

        var mockGetMethod = chai.spy.on(testAssignmentMgr,'getAssignment',() => {return Promise.resolve(mockAssignment)});
        var mockDeleteMethod = chai.spy.on(testAssignmentMgr,'deleteAssignment',() =>{return Promise.reject(new Error("Delete failed"))});
 
        chai.request(testServer).delete("/assignments/"+expectedId)
        .then(res => {
            expect(res).to.have.status(400);
            expect(mockGetMethod).to.have.been.called.with(expectedId);
            expect(mockDeleteMethod).to.have.been.called.with(mockAssignment.getID());
            expect(res.body).to.have.property("response").which.equals("Delete failed");
        });
    });
});