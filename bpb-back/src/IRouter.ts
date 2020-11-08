import express, { Router } from "express";

export interface IRouter {
    setupRoutes() : void;
}

export abstract class AbstractRouter {
    
    protected router : Router;
    route : string;

    constructor(app : any, route : string) {
        this.router = express.Router();
        this.route = route;
        app.use(route,this.router);
    }
}