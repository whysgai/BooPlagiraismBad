import express from 'express';
import fileUpload from "express-fileupload";
import mongoose from 'mongoose';
import { AppConfig } from './AppConfig';
import { AssignmentDAO } from './model/AssignmentDAO';
import { AssignmentManager } from './manager/AssignmentManager';
import { SubmissionDAO } from './model/SubmissionDAO';
import { SubmissionManager } from './manager/SubmissionManager';
import AssignmentRouter from './router/AssignmentRouter'
import SubmissionRouter from './router/SubmissionRouter'

/**
 * Represents the app itself.
 * Insantiated and executed via _main.ts
 */
class App {
    
    constructor() {}

    run() {
        
        // Set up database connection
        mongoose.connect(AppConfig.dbConnectionString(), {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(async() => {
            
            console.log("bpb-back connected to " + AppConfig.dbConnectionString());

            mongoose.connection.on('error',console.error.bind(console,'Database connection error:'));

            // Set up AssignmentDAO and Manager
            let assignmentDAO = new AssignmentDAO();
            let assignmentManager = new AssignmentManager(assignmentDAO);

            // Set up SubmissionManager
            let submissionManager = new SubmissionManager();
            
            // Set up express app
            let app = express();
            app.use(express.json());

            // Add app middleware
            app.use(fileUpload());

            // Set up routers
            let routers = []

            routers.push(new SubmissionRouter(app,'/submissions',submissionManager,assignmentManager));
            routers.push(new AssignmentRouter(app,'/assignments',submissionManager,assignmentManager));


            // Start listening for traffic
            app.listen(AppConfig.port(),() => {
                console.log("bpb-back listening on port " + AppConfig.port());
            });

        }).catch(err => console.log(err));
    }
}

export default App;
