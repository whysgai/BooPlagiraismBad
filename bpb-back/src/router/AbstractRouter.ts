import express, { Router } from "express"
import { IAssignmentManager } from "../manager/AssignmentManager";
import { ISubmissionManager } from "../manager/SubmissionManager";
import IRouter from "./IRouter";

/**
 * Router abstraction
 * Allows for development of multiple router types
 */
abstract class AbstractRouter implements IRouter {
    
    protected router : Router;
    protected submissionManager : ISubmissionManager;
    protected assignmentManager : IAssignmentManager;
    protected route : string;

    constructor(app : express.Application, route : string, submissionManager : ISubmissionManager, assignmentManager : IAssignmentManager) {
        this.router = express.Router();
        this.route = route;
        this.submissionManager = submissionManager;
        this.assignmentManager = assignmentManager;

        // Override CORS policy to enable communication from client on different port
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers',
                'Content-Type, X-Requested-With, Origin');
            res.header('Access-Control-Allow-Methods',
                'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            next();
        });

        app.use(route,this.router);
    }
}

export default AbstractRouter;