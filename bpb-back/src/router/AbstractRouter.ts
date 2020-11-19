import express, { Router } from "express"
import { IAssignmentManager } from "../manager/AssignmentManager";
import { ISubmissionManager } from "../manager/SubmissionManager";

/**
 * Used to consolidate use of Express (all routers will register via express)
 */
abstract class AbstractRouter {
    
    protected router : Router;
    protected submissionManager : ISubmissionManager;
    protected assignmentManager : IAssignmentManager;
    protected route : string;

    constructor(app : express.Application, route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager) {
        this.router = express.Router();
        this.route = route;
        this.submissionManager = submissionManager;
        this.assignmentManager = assignmentManager;
        app.use(route,this.router);
    }
}

export default AbstractRouter;