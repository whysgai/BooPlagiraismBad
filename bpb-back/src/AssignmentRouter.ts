import express, {Router} from 'express';
import assignmentModel from './AssignmentModel';

class AssignmentRouter {
  
  private router : Router;
  
  constructor() {
    this.router = express.Router();
    this.initalizeRoutes();
  }

  initalizeRoutes(){
    this.router.get('/',this.getAssignmentsFn);
    this.router.post('/',this.postAssignmentFn);
    this.router.post('/helloworld',this.postHelloWorldFn);
  }

  getRouter() {
    return this.router;
  }

  //POST: Create a single assignment
  //Currently hardcoded
  postAssignmentFn = async function(req : Express.Request,res : any){
        
    var assignment = new assignmentModel({_id: "a"}); //TODO: Remove hardcoding

    await assignment.save();

    res.send(assignment);
  }

  //GET: Get all assignments
  getAssignmentsFn = async function(req : Express.Request,res : any){
    var assignments = await assignmentModel.find();
    res.send(assignments);
  }

  postHelloWorldFn = async function(req : Express.Request,res : any){
    res.send({"data":"hello from the bpb-back assignment router!!"});
  }
}

export default AssignmentRouter;