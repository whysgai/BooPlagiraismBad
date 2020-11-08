import express from 'express';
import bodyparser from "body-parser";
import fileUpload from "express-fileupload";
import mongoose from 'mongoose';
import { AppConfig } from './AppConfig';
import AssignmentRouter from './AssignmentRouter'
import SubmissionRouter from './SubmissionRouter'

class App {
    
    constructor() {}

    run() {
        // Set up database connection
        mongoose.connect(AppConfig.dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then(async() => {
            
            console.log(AppConfig.appName + " connected to " + AppConfig.dbConnectionString);

            mongoose.connection.on('error',console.error.bind(console,'Database connection error:'));
            
            // Set up express app
            let app = express();
            app.use(express.json());

            // Add app middleware
            app.use(bodyparser);
            app.use(fileUpload);

            // Set up routers
            let routers = []
            routers.push(new SubmissionRouter(app,'/submissions'));
            routers.push(new AssignmentRouter(app,'/assignments'));

            // Start listening for traffic
            app.listen(AppConfig.port,() => {
                console.log(AppConfig.appName + " listening on port " + AppConfig.port);
            });

        }).catch(err => console.log(err));
    }
}

export default App;
