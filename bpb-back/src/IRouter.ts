import express, { Router } from "express";

interface IRouter {
    setup() : void;
    postFn(req : Express.Request, res : any) : Promise<void>;
    getFn(req : Express.Request, res : any) : Promise<void>;
    putFn(req : Express.Request, res : any) : Promise<void>;
    deleteFn(req : Express.Request, res : any) : Promise<void>;
}

export default IRouter;