import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import express, { Router } from 'express';
import {IAssignment } from '../model/Assignment'
import { IAssignmentManager } from '../model/AssignmentManager';
import { ISubmissionManager } from '../model/SubmissionManager';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  protected router : Router;
  assignmentManager : IAssignmentManager;
  submissionManager : ISubmissionManager;

  constructor(app : express.Application, route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager){
    super(app,route);
    this.setupRoutes();
    this.assignmentManager = assignmentManager;
    this.submissionManager = submissionManager;
  }

  setupRoutes() {
    this.router.post("/",this.postFn);
    this.router.get("/",this.getFn);
    this.router.get("/:id",this.getSingleFn);
    this.router.put("/:id",this.putFn);
    this.router.delete("/:id",this.deleteFn)
  }

  //GET /assignments: Get all assignments
  getFn = async(req : express.Request,res : express.Response) => {
      
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
        this.assignmentManager.updateAssignment(assignment.getID(),req.body)
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

    var assignmentId = req.params.id;
    
    if(assignmentId == undefined) {
      res.status(400);
      res.send({"response":"An assignment id was not provided"});
    } else {
      this.assignmentManager.getAssignment(assignmentId).then(assignment => {
        this.assignmentManager.deleteAssignment(assignment.getID())
        .then(() => {
          res.send({"response":"Deleted assignment " + assignmentId});
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
}

export default AssignmentRouter;