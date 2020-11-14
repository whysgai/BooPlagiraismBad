import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import express, { Router } from 'express';
import {IAssignment } from '../model/Assignment'
import { IAssignmentManager } from '../model/AssignmentManager';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  protected router : Router;
  assignmentManager : IAssignmentManager;

  constructor(app : express.Application, route : string, assignmentManager : IAssignmentManager){
    super(app,route);
    this.setupRoutes();
    this.assignmentManager = assignmentManager;
  }

  setupRoutes() {
    this.router.post("/",this.postFn);
    this.router.get("/",this.getFn);
    this.router.get("/:id",this.getSingleFn);
    this.router.put("/:id",this.putFn);
    this.router.delete("/:id",this.deleteFn)
  }

  //GET /assignments: Get all assignments
  getFn = async(req : express.Request,res : any) => {
      
    this.assignmentManager.getAssignments()
        .then((assignments: IAssignment[]) => {
          var assignmentEntries = assignments.map((assignment) => { return assignment.asJSON(); });
          var responseBody = { assignments:assignmentEntries }
          res.send(responseBody);
        }).catch((err) => {
          res.status(400)
          res.send({"response":err.message});
        });
  };
  
  //GET /assignments/{id} : Get assignment with {id}
  getSingleFn = async(req : express.Request,res : express.Response) => {
    
    var assignmentId = req.params.id;
    
    if(assignmentId == undefined) {
      res.status(400);
      res.send({"response":"An assignment id was not provided"});
    } else {
      this.assignmentManager.getAssignment(assignmentId)
      .then(assignment => {
        res.send(assignment.asJSON());
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
    }
  }

  //POST /assignments: Create a new assignment
  postFn = async(req : express.Request,res : express.Response) => {

    var assignmentName = req.body.name;

    if(assignmentName == undefined) {
      res.status(400);
      res.send({"response":"An assignment name was not provided"});
    } else {
      this.assignmentManager.createAssignment(req.body)
      .then(assignment => {
        res.send(assignment.asJSON());
      }).catch((err) => {
        res.status(400);  
        res.send({"response":err.message});
      });
    }
  }

  //PUT /assignments : Update an assignment
  putFn = async(req : express.Request,res : express.Response) => {

    var assignmentId = req.params.id;
    
    if(assignmentId == undefined) {
      res.status(400);
      res.send({"response":"An assignment id was not provided"});
    } else {
      this.assignmentManager.getAssignment(assignmentId).then(assignment => {
        this.assignmentManager.updateAssignment(assignment,req.body)
        .then(assignment => {
          res.send(assignment.asJSON());
        }).catch((err) => {
          res.status(400);  
          res.send({"response":err.message});
        });
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
    }
  }

  //DELETE /assignments/{id} : Delete assignment with {id}
  deleteFn = async(req : express.Request,res : express.Response) => {
    //TODO: Implement
    res.status(400);
    res.send({"response":"Deleting assignments is not yet supported"});
  }
}

export default AssignmentRouter;