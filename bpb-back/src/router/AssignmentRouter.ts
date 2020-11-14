import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import { Router } from 'express';
import { AssignmentFactory } from '../model/AssignmentFactory';
import { Assignment, IAssignment } from '../model/Assignment'
import { AssignmentManager, IAssignmentManager } from '../model/AssignmentManager';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  protected router : Router;
  private assignmentManager : IAssignmentManager;

  constructor(app : any, route : string, assignMgr : IAssignmentManager){
    super(app,route);
    this.setupRoutes();
    this.assignmentManager = assignMgr;
  }

  setupRoutes() {
    this.router.put("/",this.putFn);
    this.router.get("/",this.getFn)
    this.router.post("/",this.postFn);
    this.router.delete("/",this.deleteFn)
    this.router.get("/helloworld",this.getHelloWorldFn);
  }

  //GET /assignments: Get all assignments
  getFn = async function(req : Express.Request,res : any){
    // var assignments = await Assignment.getStaticModel().find();
    console.log("Mgr defined? " + assignmentManager);
    assignmentManager.getAssignments()
      .then((assignments: IAssignment[]) => {
        res.send(assignments.map((assignment) => {
          assignment.asJSON();
        }))
      });
  }

  //POST /assignments: Create a new assignment
  postFn = async function(req : Express.Request,res : any){
    var assignment = AssignmentFactory.buildAssignment("test","test");
    await assignment.getModelInstance().save();
    res.send(assignment);
  }

  //PUT /assignments : Update an assignment
  putFn = async function(req : Express.Request,res : any){
    res.status(400);
    res.send({"response":"Updating assignments is not yet supported"});
  }

  //DELETE /assignments/{id} : Delete assignment with {id}
  deleteFn = async function(req : Express.Request,res : any){
    //TODO: Implement
    res.status(400);
    res.send({"response":"Deleting assignments is not yet supported"});
  }

  //GET /assignments/{id} : Get assignment with {id}
  getSingleFn = async function(req : Express.Request,res : any){
    //TODO: Implement
    res.status(400);
    res.send({"response":"Accessing single assignments is not yet supported"});
  }

  //Hello World function (for testing)
  getHelloWorldFn = async function(req : Express.Request,res : any){
    res.send({"response":"the world and the bpb-back assignment router say hi back!!"});
  }
}

export default AssignmentRouter;