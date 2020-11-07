import IRouter from './IRouter';
import AbstractRouter from './AbstractRouter';
import assignmentModel from './AssignmentModel';

class AssignmentRouter extends AbstractRouter implements IRouter {
  
  constructor(app : any, route : string){
    super(app,route);
    app.get(route+'/helloworld',this.getHelloWorldFn);
  }

  //POST /assignments: Create a new assignment
  postFn = async function(req : Express.Request,res : any){
    var assignment = new assignmentModel({_id: "a"}); //TODO: Remove hardcoding
    await assignment.save();
    res.send(assignment);
  }

  //GET /assignments : Get all assignemtns
  getFn = async function(req : Express.Request,res : any){
    var assignments = await assignmentModel.find();
    res.send(assignments);
  }

  //GET /assignments/{id} : Get assignment with {id}
  getSingleFn = async function(req : Express.Request,res : any){
    //TODO: Implement]
    res.send({"response":"Accessing single assignments is not yet supported"});
  }

  //Hello World function (for testing)
  getHelloWorldFn = async function(req : Express.Request,res : any){
    res.send({"data":"hello from the bpb-back assignment router!!"});
  }
}

export default AssignmentRouter;