import express from 'express';
import fileUpload from "express-fileupload";
import mongoose from 'mongoose';
import { AssignmentManager } from './manager/AssignmentManager';
import { SubmissionManager } from './manager/SubmissionManager';
import IRouter from './router/IRouter';
import AssignmentRouter from './router/AssignmentRouter'
import SubmissionRouter from './router/SubmissionRouter'

/**
 * Represents the app itself.
 * Insantiated and executed via _main.ts
 */
class App {
    
    dbConnectionString : string;
    port : string;
    routers : IRouter[];
    app : express.Application;
    server : any;

    constructor(dbConnectionString : string, port : string) {
        this.dbConnectionString = dbConnectionString;
        this.port = port;
        this.routers = [];
        this.app = express();
        this.app.use(express.json());
        this.app.use(fileUpload());
        this.server = undefined;
    }

    /**
     * Bootstraps the app database
     * Runs the app server
     */
    async run() {
        
        return new Promise((resolve,reject) => {

            // Set up database connection
            mongoose.connect(this.dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(async() => {
                
                console.log("bpb-back connected to " + this.dbConnectionString);

                mongoose.connection.on('error',(err) => {
                    reject(err);
                });

                // Set up AssignmentManager
                var assignmentManager = new AssignmentManager();

                // Set up SubmissionManager
                var submissionManager = new SubmissionManager();

                // Set up routers
                this.routers.push(new SubmissionRouter(this.app,'/submissions',submissionManager,assignmentManager));
                this.routers.push(new AssignmentRouter(this.app,'/assignments',submissionManager,assignmentManager));

                // Start listening for traffic
                this.server = this.app.listen(this.port,() => {

                    console.log("bpb-back listening on port " + this.port);
                    
                    this.server.on("close",() => {
                        console.log("bpb-back shutting down...");
                        mongoose.disconnect();
                    });

                    resolve();
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }

    shutDown() : void {
        this.server.close();
    }
}

export default App;