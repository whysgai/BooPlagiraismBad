import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import express, { Router } from 'express';
import {IAssignment } from '../model/Assignment'
import { IAssignmentManager } from '../model/AssignmentManager';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  protected router : Router;
  assignmentManager : IAssignmentManager;

  constructor(app : any, route : string, assignmentManager : IAssignmentManager){
    super(app,route);
    this.setupRoutes();
    this.assignmentManager = assignmentManager;
  }

  setupRoutes() {
    this.router.put("/",this.putFn);
    this.router.get("/",this.getFn)
    this.router.post("/",this.postFn);
    this.router.delete("/",this.deleteFn)
    this.router.get("/helloworld",this.getHelloWorldFn);
  }

  //GET /assignments: Get all assignments
  getFn = async(req : Express.Request,res : any) => {
      this.assignmentManager.getAssignments()
        .then((assignments: IAssignment[]) => {
          var assignmentEntries = assignments.map((assignment) => { return assignment.asJSON(); });
          var responseBody = { assignments:assignmentEntries }
          res.send(responseBody);
        });
  };

  //POST /assignments: Create a new assignment
  postFn = async(req : Express.Request,res : express.Response) => {
    //TODO: Implement
    res.status(400);
    res.send({"response":"Creating assignments is not yet supported"});
  }

  //PUT /assignments : Update an assignment
  putFn = async(req : Express.Request,res : express.Response) => {
    //TODO: Implement
    res.status(400);
    res.send({"response":"Updating assignments is not yet supported"});
  }

  //DELETE /assignments/{id} : Delete assignment with {id}
  deleteFn = async(req : Express.Request,res : express.Response) => {
    //TODO: Implement
    res.status(400);
    res.send({"response":"Deleting assignments is not yet supported"});
  }

  //GET /assignments/{id} : Get assignment with {id}
  getSingleFn = async(req : Express.Request,res : express.Response) => {
    //TODO: Implement
    res.status(400);
    res.send({"response":"Accessing single assignments is not yet supported"});
  }

  //Hello World function (for testing)
  getHelloWorldFn = async(req : Express.Request,res : express.Response) => {
    res.send({"response":"the world and the bpb-back assignment router say hi back!!"});
  }
}

export default AssignmentRouter;