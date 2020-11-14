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
    this.router.get("/compare?a=subid1&b=subid2",this.getComparisonResultFn); //TODO: un-hardcode
    this.router.post("/sub1/files",this.postFileUploadFn);
    this.router.get("/sub1/files",this.getSubmissionFilesFn);
    this.router.get("/sub1/files/AXHFD",this.getFileContentFn);
  }

  getHelloWorldFn = async function(req : Express.Request,res : any){
    res.send({"response":"the world and the bpb-back submission router say hi back!!"});
  }
  
  //TODO: Replace
  //Hardcoded endpoints for front-end development purposes
  getSubmissionFilesFn = async function(req : Express.Request,res : any){
    res.send({"sub_id":"sub1","files":[{"name":"testy.java","id":"AXHFD"},{"name":"son_of_testy.java","id":"NONEXISITO"}]});
  }

  //TODO: Replace
  //Hardcoded endpoints for front-end development purposes
  getComparisonResultFn = async function(req : Express.Request,res : any){
    res.send({
        "matches":[
          [{"sub_id":"subid1","file_path":"/test/file.java","context":"method","start":1,"end":2,"hash":"245rr1","text":"void test() { }"},{"sub_id":"subid2","file_path":"/test/file2.java","context":"method","start":5,"end":6,"hash":"423qq1","text":"void rest() { }"}],
          [{"sub_id":"subid1","file_path":"/test/file33.java","context":"method","start":5,"end":7,"hash":"jldf","text":"void simultaneous() { }"},{"sub_id":"subid2","file_path":"/test/filere.java","context":"method","start":8,"end":10,"hash":"423wqq1","text":"void simulate() { }"}]
        ] 
      });
  }

  //TODO: Replace
  //Hardcoded endpoint for front-end development purposes
  getFileContentFn = async function (req : Express.Request,res : any){
    res.send({id : "AXHFD", name : "testy.java", data :"void this() { \n      is \n      an \n      examples! \n } "});
  }

  //TODO: Replace
  //Hardcoded test endpoint for front-end development purposes
  postFileUploadFn = async function (req : Express.Request,res : any){

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