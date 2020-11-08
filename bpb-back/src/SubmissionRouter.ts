import IRouter from './IRouter'
import AbstractRouter from './AbstractRouter'

class SubmissionRouter extends AbstractRouter implements IRouter {
  
  constructor(app : any,route : string) {
    super(app,route);
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get("/helloworld",this.getHelloWorldFn);
    this.router.get("/compare/placeholder",this.getPlaceholderAnalysisResultFn);
    this.router.post("/upload",this.postFileUploadFn);
  }
  
  getHelloWorldFn = async function(req : Express.Request,res : any){
    res.send({"response":"the world and the bpb-back submission router say hi back!!"});
  }

  //TODO: Replace these
  //Hardcoded endpoints for front-end development purposes
  getPlaceholderAnalysisResultFn = async function(rq : Express.Request,res : any){
    res.send({
        "matches":[
            {"fromSubmission":"id1","toSubmission":"id2","fromFile":"test","toFile":"test","fromStart":1,"fromEnd":2,"toStart":3,"toEnd":6,"type":"BasicMatch","description":"Test Description for match 1"},
            {"fromSubmission":"id1","toSubmission":"id2","fromFile":"test2","toFile":"test3","fromStart":14,"fromEnd":22,"toStart":30,"toEnd":90,"type":"BasicMatch","description":"Test Description for match 2"}
        ] 
      });
  }

  //TODO: Replace this
  //Hardcoded test endpoint for example purposes
  postFileUploadFn = async function (req : Express.Request,res : any){
    res.send({"response":"not yet implemented"}); //TODO
  });
}

export default SubmissionRouter;