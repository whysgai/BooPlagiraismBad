import express, { Router } from "express"

/**
 * Used to consolidate use of Express (all routers will register via express)
 */
abstract class AbstractRouter {
    
    protected router : Router;
    route : string;

    constructor(app : any, route : string) {
        this.router = express.Router();
        this.route = route;
        app.use(route,this.router);
    }
}

export default AbstractRouter;