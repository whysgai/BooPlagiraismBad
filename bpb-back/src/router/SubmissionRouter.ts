import express from 'express';
import AbstractRouter from './AbstractRouter'
import { AppConfig } from '../AppConfig';
import { ISubmissionManager } from '../manager/SubmissionManager';
import { IAssignmentManager } from '../manager/AssignmentManager';
import { ISubmission } from '../model/Submission';
import { Worker } from 'worker_threads';

/**
 * Router for requests related to Submissions
 */
class SubmissionRouter extends AbstractRouter {
    
  constructor(app : any,route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager) {
    super(app,route, submissionManager, assignmentManager);
    this.setupRoutes();
  }

  /**
   * Binds routes to the express router
   */
  setupRoutes() {
    this.router.post("/",this.createSubmissionFn);
    this.router.put("/:id",this.updateSubmissionFn);
    this.router.delete("/:id",this.deleteSubmissionFn);
    this.router.get("/:id/files/:fileId([0-9]{1,})",this.getSubmissionFileContentsFn);
    this.router.post("/:id/files",this.createSubmissionFileFn);
    this.router.get("/ofAssignment/:id", this.getSubmissionsOfAssignmentFn);
    this.router.get("/:id", this.getSubmissionFn);
    this.router.get("/compare/:ida/:idb",this.compareSubmissionsFn);
  }

  //POST / : Create a submission with the provided name and assignment_id
  /**
   * POST /submissions: Create a submission with the provided data
   * @param req must have a body with properties name, assignment_id
   * @param res 200 and JSON body if submission is created, 400 otherwise
   */
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

  /**
   * GET /submissions/ofAssignment/{id}: Get all submissions of the specified assignment
   * @param req must have parameter id
   * @param res 200 and JSON body if submissions are found, 400 otherwise
   */
  getSubmissionsOfAssignmentFn = async(req : express.Request,res : express.Response) => {
    var assignmentId = req.params.id; 
    this.assignmentManager.getAssignment(assignmentId)
      .then((assignment) => {
        this.submissionManager.getSubmissions(assignmentId)
          .then((submissions: ISubmission[]) => {
            var submissionEntries = submissions.map((submission) => { return submission.getId(); });
            var responseBody = { submissionIds:submissionEntries }
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

  /**
   * GET /submissions/{id}: Get a submission by submissionId
   * @param req must have parameter id 
   * @param res 200 and JSON body if submission is found, 400 otherwise
   */
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

  /**
   * PUT /submissions/{id} : Update a given submission with the provided data
   * @param req must have a body with name, assignment_id properties
   * @param res 200 and JSON body if submission was updated, 400 otherwise
   */
  updateSubmissionFn = async(req : express.Request,res : express.Response) => {
    var submissionId = req.params.id; 
    var name = req.body.name;
    var assignment_id = req.body.assignment_id;

    if(name == undefined || assignment_id == undefined) {
      res.status(400);
      res.send({"response":"name and assignment_id properties must both be defined on the request body"});
    } else {
      var submissionData = {name:name,assignment_id:assignment_id}
      this.submissionManager.updateSubmission(submissionId, submissionData)
      .then((submission) => {
        res.send(submission.asJSON());  
      }).catch((err) => {
        res.status(400);
        res.send({"response":err.message});
      });
    }
  }

  /**
   * DELETE /submissions/{id} : Delete the submission with the specified submissionId
   * @param req must have parameter id
   * @param res 200 and JSON body if submission is deleted, 400 otherwise
   */
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
  
  /**
   * GET /compare/{id_a}/{id_b} : Compare two submissions 
   * @param req must have parameters ida and idb
   * @param res 200 and JSON body (comparison analysis result) if comparison is successful, 400 otherwise
   */
  compareSubmissionsFn = async(req : express.Request,res : express.Response) => {
    const submissionIdA = req.params.ida;
    const submissionIdB = req.params.idb;

    const worker = new Worker('./CompareWorker.js', { 
        workerData: [this.submissionManager,submissionIdA,submissionIdB]
    });
  
    worker.once('message', (analysisResultsJson) => {
      console.log("Comparison complete");
        res.status(200);
        res.send(analysisResultsJson);
    });
  }

  /**
   * POST /submissions/{id}/files : Upload a file to a given submission
   * @param req must have multipart-formbody data associated with key name submissionFile. Data must be less than the configured max size (in bytes)
   * @param res 200 and JSON body if file is uploaded, 400 otherwise
   */
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
         
        const maxFileSize = AppConfig.maxFileUploadSize();

        if(submissionFile.size >= maxFileSize) {
          res.status(400);
          res.send({"response":"The file specified for upload is too large. The maximum individual file size is " + maxFileSize});
        } else {

          const fileName = submissionFile.name
          let content = submissionFile.data.toString();
            this.submissionManager.getSubmission(submissionId).then((submission : ISubmission) => {
  
              this.submissionManager.processSubmissionFile(submission.getId(),fileName, content).then(() => {
            
                res.send({
                  "response": "File " + fileName + " uploaded to submission successfully."
                });
              }).catch((err) => {
                res.status(400);
                res.send({"response":err.message});
              });
            }).catch((err) => {
                res.status(400);
                res.send({"response":err.message});
            });
        }
      }
    } 
  }
   
  /**
   * GET /submissions/{id}/files/{n} : Get the content of the specified submission's nth file as a string
   * @param req must have parameters id (string), fileId (number, zero-indexed)
   * @param res 200 and file content in JSON body if file content is retrieved, 400 otherwise
   */
  getSubmissionFileContentsFn = async (req : express.Request,res : express.Response) => {

    var submissionId = req.params.id;
    var fileIndex = Number(req.params.fileId); 
    
    this.submissionManager.getSubmission(submissionId).then((submission) => {

      var fileNames = submission.getFiles();

      if(fileNames.length == 0) {
        res.status(400);
        res.send({"response":"The specified submission has no files"});
      } else {
        if(fileIndex < 0 || fileIndex > (fileNames.length - 1)) {
          res.status(400);
          res.send({"response":"The provided file index is out of bounds"});
        } else {
          this.submissionManager.getSubmissionFileContent(submissionId,fileNames[fileIndex]).then((fileContent) => {
            res.status(200);
            res.send({"content":fileContent});
          }).catch((err) => {
            res.status(400);
            res.send({"response":err.message});
          });
        }
      }
    }).catch((err) => {
      res.status(400);
      res.send({"response":err.message});
    });
  }
}

export default SubmissionRouter;