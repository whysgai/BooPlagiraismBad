import IRouter from './IRouter'
import AbstractRouter from './AbstractRouter'
import { AppConfig } from '../AppConfig';

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
  //TODO: Update! Format is no longer accurate
  //Hardcoded endpoints for front-end development purposes
  getPlaceholderAnalysisResultFn = async function(rq : Express.Request,res : any){
    res.send({
        "matches":[
            {"fromSubmission":"id1","toSubmission":"id2","fromFile":"test","toFile":"test","fromStart":1,"fromEnd":2,"toStart":3,"toEnd":6,"type":"BasicMatch","description":"Test Description for match 1"},
            {"fromSubmission":"id1","toSubmission":"id2","fromFile":"test2","toFile":"test3","fromStart":14,"fromEnd":22,"toStart":30,"toEnd":90,"type":"BasicMatch","description":"Test Description for match 2"}
        ] 
      });
  }

  //TODO: Replace
  //Hardcoded test endpoint for example purposes
  postFileUploadFn = async function (req : Express.Request,res : any){
    console.log("FILES HERE");
    console.log(req.files);

    try {
      if(!req.files) {
          res.status(400);
          res.send({response:"No file was included in this request. Please ensure a file is provided."})
      } else {
        let submissionFile = req.files.submissionfile;
        
        if(!submissionFile) {
          res.status(400);
          res.send({"response":"File was not submitted using the key name submissionfile. Please resend the file using that key."});
        } else {
          submissionFile.mv(AppConfig.submissionFileUploadDirectory() + submissionFile.name);

          //TODO: call SubmissionManager.addFile here 

          res.send({
              "response": 'File uploaded successfully.',
              "data": {
                  "name": submissionFile.name,
                  "size": submissionFile.size
              }
            }
          );
        }
      } 
    } catch (err) {
        res.status(500);
        res.send(err);
    }
  }
}

export default SubmissionRouter;