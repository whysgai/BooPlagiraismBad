import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import express, { Router } from 'express';
import {IAssignment } from '../model/Assignment'
import { IAssignmentManager } from '../manager/AssignmentManager';
import { ISubmissionManager } from '../manager/SubmissionManager';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  constructor(app : express.Application, route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager){
    super(app,route,submissionManager,assignmentManager);
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post("/",this.createAssignmentFn);
    this.router.get("/",this.getAssignmentsFn);
    this.router.get("/:id",this.getAssignmentFn);
    this.router.put("/:id",this.updateAssignmentFn);
    this.router.delete("/:id",this.deleteAssignmentFn);
  }

  //POST /assignments: Create a new assignment
  createAssignmentFn = async(req : express.Request,res : express.Response) => {

  //TODO: Add checks to esnure submission ids exist before update
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

  //GET /assignments: Get all assignments
  getAssignmentsFn = async(req : express.Request,res : express.Response) => {
      
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
  getAssignmentFn = async(req : express.Request,res : express.Response) => {
    
    var assignmentId = req.params.id;
  
    this.assignmentManager.getAssignment(assignmentId)
    .then(assignment => {
      res.send(assignment.asJSON());
    }).catch((err) => {
      res.status(400);
      res.send({"response":err.message});
    });
}
  //PUT /assignments : Update an assignment
  //TODO: Add checks to ensure submission ids exist before update
  updateAssignmentFn = async(req : express.Request,res : express.Response) => {

    var assignmentId = req.params.id;
    
    if(!req.body.name && !req.body.submissions) {
      res.status(400);
      res.send({"response":"A request body was not provided, or the provided request body is missing both name and submissions properties"});
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
  deleteAssignmentFn = async(req : express.Request,res : express.Response) => {

    var assignmentId = req.params.id;
    
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
      res.send({"response":err.message});;
    });
  }
}

export default AssignmentRouter;