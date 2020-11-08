import express, { Router } from "express";

interface IRouter {
    setupRoutes() : void;
}


export default IRouter;