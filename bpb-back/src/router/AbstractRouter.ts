const cors = require('cors');
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

        app.use(cors({origin: false })); //Disable CORS (TODO: enable) 
        app.use(route,this.router);
    }

    /**
     * Initialize routes (i.e. specify routes and bind them to the Express router) 
     */
    setupRoutes(){}
}

export default AbstractRouter;