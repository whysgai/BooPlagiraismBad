import express from 'express';
import mongoose from 'mongoose';
import { AppConfig } from './AppConfig';
import AssignmentRouter from './AssignmentRouter'

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

            // Set up routes  
            app.use('/assignment', new AssignmentRouter().getRouter());
            //TODO: Add SubmissionRouter
            
            // Start listening for traffic
            app.listen(AppConfig.port,() => {
                console.log(AppConfig.appName + " listening on port " + AppConfig.port);
            });

        }).catch(err => console.log(err));
    }
}

export default App;
