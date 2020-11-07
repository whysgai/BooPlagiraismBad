import express, { Router } from "express";
import IRouter from "./IRouter";

abstract class AbstractRouter implements IRouter {
    
    private router : Router;

    constructor(app : any, route : string) {
        this.router = express.Router();
        app.use(route,this.router);
        this.setup();
    }

    setup() : void {
        this.router.post('/',this.postFn);
        this.router.get('/',this.getFn);
        this.router.put('/',this.putFn);
        this.router.delete('/',this.deleteFn);
      }
    
    postFn = async function(req: Express.Request, res: any): Promise<void> {
        res.send({"response":"Router does not support POST requests (not implemented)"});
    }

    getFn = async function(req: Express.Request, res: any): Promise<void> {
        res.send({"response":"Router does not support GET requests (not implemented)"});
    }

    putFn = async function(req: Express.Request, res: any): Promise<void> {
        res.send({"response":"Router does not support PUT requests (not implemented)"});
    }

    deleteFn = async function(req: Express.Request, res: any): Promise<void> {
        res.send({"response":"Router does not support DELETE requests (not implemented)"});
    }
}

export default AbstractRouter;