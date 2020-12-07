import express from 'express';
import AbstractRouter from './AbstractRouter';
import {IAssignment } from '../model/Assignment'
import { IAssignmentManager } from '../manager/AssignmentManager';
import { ISubmissionManager } from '../manager/SubmissionManager';

/**
 * Router for requests related to Assignments
 */
class AssignmentRouter extends AbstractRouter {
  
  constructor(app : express.Application, route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager){
    super(app,route,submissionManager,assignmentManager);
    this.setupRoutes();
  }

  /**
   * Binds routes to the express router
   */
  setupRoutes() {
    this.router.post("/",this.createAssignmentFn);
    this.router.get("/",this.getAssignmentsFn);
    this.router.get("/:id",this.getAssignmentFn);
    this.router.put("/:id",this.updateAssignmentFn);
    this.router.delete("/:id",this.deleteAssignmentFn);
  }

  /**
   * POST /assignments: Create a new assignment
   * @param req must have a body with property name
   * @param res 200 and JSON body if assignment is created, otherwise 400
   */
  createAssignmentFn = async(req : express.Request,res : express.Response) => {

  //TODO: Add checks to ensure submission ids exist before creating 
    let assignmentName = req.body.name;

    if(assignmentName == undefined) {
      res.status(400);
      res.send({"response":"An assignment name was not provided"});
    } else {

      let createBody = {"name":assignmentName}

      this.assignmentManager.createAssignment(createBody)
      .then(assignment => {
        res.send(assignment.asJSON());
      }).catch((err) => {
        res.status(400);  
        res.send({"response":err.message});
      });
    }
  }

  /**
   * GET /assignments: Get all assignments
   * @param req
   * @param res 200 and list of JSON bodies if assignments are found, otherwise 400 
   */
  getAssignmentsFn = async(req : express.Request,res : express.Response) => {
      
    this.assignmentManager.getAssignments()
        .then((assignments: IAssignment[]) => {
          let assignmentEntries = assignments.map((assignment) => { return assignment.asJSON(); });
          let responseBody = { assignments:assignmentEntries }
          res.send(responseBody);
        }).catch((err) => {
          res.status(400)
          res.send({"response":err.message});
        });
  };
 
  /**
   * GET/assignments/{id}: Get a specific assignment by assignmentId
   * @param req must have id parameter
   * @param res 200 and JSON body if assignment is found, otherwise 400
   */
  getAssignmentFn = async(req : express.Request,res : express.Response) => {
    
    let assignmentId = req.params.id;
  
    this.assignmentManager.getAssignment(assignmentId)
    .then(assignment => {
      res.send(assignment.asJSON());
    }).catch((err) => {
      res.status(400);
      res.send({"response":err.message});
    });
}
  /**
   * PUT /assignments: Update an assignment's metadata
   * @param req must have a body with id properties
   * @param res 200 and JSON body if assignment is updated, otherwise 400
   */
  updateAssignmentFn = async(req : express.Request,res : express.Response) => {

  //TODO: Add checks to ensure submission ids exist before update
    let assignmentId = req.params.id;
    
    if(!req.body.name) {
      res.status(400);
      res.send({"response":"A request body was not provided, or the provided request body is missing name property"});
    } else {
      
      let updateBody = {"name":req.body.name}

      this.assignmentManager.updateAssignment(assignmentId,updateBody)
      .then(assignment => {
        res.send(assignment.asJSON());
      }).catch((err) => {
        res.status(400);  
        res.send({"response":err.message});
      });
    }
  }

  /**
   * DELETE /assignments/{id}: Delete the assignment with the specified assignmentId
   * @param req must have id parameter
   * @param res 200 and JSON response if assignment is deleted, otherwise 400
   */
  deleteAssignmentFn = async(req : express.Request,res : express.Response) => {

    let assignmentId = req.params.id;
    
      this.assignmentManager.deleteAssignment(assignmentId)
      .then(() => {
        res.send({"response":"Deleted assignment " + assignmentId});
      }).catch((err) => {
        res.status(400);  
        res.send({"response":err.message});
      });
  }
}

export default AssignmentRouter;