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
        
        var createBody = {name:submissionName,assignment_id:assignment.getId()};
        
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
    var assignmentId = req.params.id; 
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
    var submissionId = req.params.id; 
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
    var submissionId = req.params.id; 
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
    var submissionId = req.params.id; 
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

    if(!req.files) {
        res.status(400);
        res.send({"response":"No file was included in this request. Please ensure a file is provided."})
    } else {
      let submissionFile = req.files.submissionFile;
      if(!submissionFile) {
        res.status(400);
        res.send({"response":"File was not submitted using the key name submissionFile. Please resend the file using that key (case sensitive)"});
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
  }
}

export default SubmissionRouter;