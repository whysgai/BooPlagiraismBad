import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import assignmentModel from '../model/AssignmentModel';
import { Router } from 'express';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  protected router : Router;

  constructor(app : any, route : string){
    super(app,route);
    this.setupRoutes();
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
    var assignments = await assignmentModel.find();
    res.send(assignments);
  }

  //POST /assignments: Create a new assignment
  postFn = async function(req : Express.Request,res : any){
    var assignment = new assignmentModel({_id: "a"}); //TODO: Remove hardcoding
    await assignment.save();
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