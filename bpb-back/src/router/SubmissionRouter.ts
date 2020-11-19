import express from 'express';
import IRouter from './IRouter'
import AbstractRouter from './AbstractRouter'
import { AppConfig } from '../AppConfig';
import { ISubmissionManager } from '../manager/SubmissionManager';
import { IAssignmentManager } from '../manager/AssignmentManager';
import { ISubmission } from '../model/Submission'

/**
 * Router for requests related to Submissions
 */
class SubmissionRouter extends AbstractRouter implements IRouter {
    
  constructor(app : any,route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager) {
    super(app,route, submissionManager, assignmentManager);
    this.setupRoutes();
  }

  setupRoutes() {
  
    //Development Endpoints   
    this.router.get("/sub1/files",this.mockGetSubmissionFilesFn);
    this.router.get("/compare?a=subid1&b=subid2",this.mockGetComparisonResultFn); //TODO: un-hardcode
    this.router.get("/sub1/files/AXHFD",this.mockGetSubmissionFileFn);
  
    //Endpoints
    this.router.post("/",this.createSubmissionFn);
    this.router.put("/:id",this.updateSubmissionFn);
    this.router.delete("/:id",this.deleteSubmissionFn);
    this.router.post("/:id/files",this.createSubmissionFileFn);
    this.router.get("/ofAssignment/:id", this.getSubmissionsOfAssignmentFn);
    this.router.get("/:id", this.getSubmissionFn);
    this.router.get("/compare/:ida/:idb",this.compareSubmissionsFn);
  }

  //POST / : Create a submission with the provided name and assignment_id
  createSubmissionFn = async(req : express.Request,res : express.Response) => {
    var submissionName = req.body.name;
    var assignmentId = req.body.assignment_id;

    if(submissionName == undefined || assignmentId == undefined) {
      res.status(400);
      res.send({"response":"name and assignment_id properties must both be present in the request body"});
      return;
    }

    this.assignmentManager.getAssignment(assignmentId)
      .then((assignment) => {
        
        var createBody = {name:submissionName,assignment_id:assignment.getID()};
        
        this.submissionManager.createSubmission(createBody)
        .then((submission) =>{
          res.status(200);
          res.send(submission.asJSON());
        }).catch((err) => {
          res.status(400);
          res.send({"response":err.message});
        })
      })
      .catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      })
  }

  //GET /ofAssignment?id:{id} : Get all submissions for the specified assignment
  getSubmissionsOfAssignmentFn = async(req : express.Request,res : express.Response) => {
    var assignmentId = req.params.id; //NOTE: Lack of defensive coding/tests due to assumption that router won't match this route if id is nonexistent
    this.assignmentManager.getAssignment(assignmentId)
      .then((assignment) => {
        this.submissionManager.getSubmissions(assignmentId)
          .then((submissions: ISubmission[]) => {
            var submissionEntries = submissions.map((submission) => { return submission.asJSON(); });
            var responseBody = { submissions:submissionEntries }
            res.send(responseBody);
          }).catch((err) => {
            res.status(400)
            res.send({"response":err.message});
          });
      }).catch((err) => {
        res.status(400)
        res.send({"response":err.message});
      });
  }

  //GET /{id} : Get a submission by ID
  getSubmissionFn = async(req : express.Request,res : express.Response) => {    
    var submissionId = req.params.id; //NOTE: Lack of defensive coding/tests intentional (see above)
    this.submissionManager.getSubmission(submissionId)
      .then((submission) => {
        res.send(submission.asJSON());  
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
  }

  //PUT /{id} : Update a given submission's name or associated assignment
  updateSubmissionFn = async(req : express.Request,res : express.Response) => {
    var submissionId = req.params.id; //NOTE: Lack of defensive coding/tests intentional (see above)
    var submissionData = req.body;
    this.submissionManager.updateSubmission(submissionId, submissionData)
      .then((submission) => {
        res.send(submission.asJSON());  
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
  }

  //DELETE /{id} : Delete a given submission
  deleteSubmissionFn = async(req : express.Request,res : express.Response) => {
    var submissionId = req.params.id; //NOTE: Lack of defensive coding/tests intentional (see above)
    this.submissionManager.deleteSubmission(submissionId)
      .then(() => {
        res.status(200);
        res.send({"response":"Deleted submission " + submissionId});
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
  }

  //GET /compare/?a={ida}&b={idb} : Compare two submissions
  compareSubmissionsFn = async(req : express.Request,res : express.Response) => {
    const submissionIdA = req.params.ida;
    const submissionIdB = req.params.idb;
    this.submissionManager.compareSubmissions(submissionIdA, submissionIdB)
      .then((analysisResult) => {
        res.status(200);
        res.send(analysisResult.asJSON());
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
  }
  
  //POST /{id}/files : Upload a file to a given submission
  createSubmissionFileFn = async (req : express.Request,res : express.Response) => {

    var submissionId = req.params.id;

    if(submissionId == undefined) {
      res.status(400);
      res.send({"response":"A submission id was not provided"});
    } else {
     
      try {
        if(!req.files) {
            res.status(400);
            res.send({"response":"No file was included in this request. Please ensure a file is provided."})
        } else {
          let submissionFile = req.files.submissionFile;
          if(!submissionFile) {
            res.status(400);
            res.send({"response":"File was not submitted using the key name submissionfile. Please resend the file using that key."});
          } else {
              
            const filePath = AppConfig.submissionFileUploadDirectory() + submissionFile.name;

            submissionFile.mv(filePath).then(() => {
              
              this.submissionManager.getSubmission(submissionId).then((submission : ISubmission) => {

                this.submissionManager.processSubmissionFile(submission.getId(),filePath).then(() => {
              
                  res.send({
                    "response": 'File uploaded to submission successfully.',
                    "data": {
                        "name": submissionFile.name,
                        "size": submissionFile.size
                    }
                  });
                });
              });
            });
          }
        } 
      } catch (err) {
          res.status(500);
          res.send(err);
      }
    }
  }

 //TODO: Replace
  //Hardcoded endpoints for front-end development purposes
  mockGetSubmissionFilesFn = async(req : express.Request,res : express.Response) => {
    res.send({"sub_id":"sub1","files":[{"name":"testy.java","id":"AXHFD"},{"name":"son_of_testy.java","id":"NONEXISITO"}]});
  }

  //TODO: Replace
  //Hardcoded endpoints for front-end development purposes
  mockGetComparisonResultFn = async (req : express.Request,res : express.Response) => {
    res.send({
        "matches":[
          [{"sub_id":"subid1","file_path":"/test/file.java","context":"method","start":1,"end":2,"hash":"245rr1","text":"void test() { }"},{"sub_id":"subid2","file_path":"/test/file2.java","context":"method","start":5,"end":6,"hash":"423qq1","text":"void rest() { }"}],
          [{"sub_id":"subid1","file_path":"/test/file33.java","context":"method","start":5,"end":7,"hash":"jldf","text":"void simultaneous() { }"},{"sub_id":"subid2","file_path":"/test/filere.java","context":"method","start":8,"end":10,"hash":"423wqq1","text":"void simulate() { }"}]
        ] 
      });
  }

  //TODO: Replace
  //Hardcoded endpoint for front-end development purposes
  mockGetSubmissionFileFn = async (req : express.Request,res : express.Response) => {
    res.send({id : "AXHFD", name : "testy.java", data :"void this() { \n      is \n      an \n      examples! \n } "});
  }
 
}

export default SubmissionRouter;