import { Connection } from "mongoose";

export class AppConfig {
    dbConnection : Connection;
    public static appName : string = 'bpb-back';
    public static port : number = 8080;
    public static dbConnectionString : string = 'mongodb://127.0.0.1:27017/bpb';
    public static submissionFileUploadDirectory : string = "/vagrant/bpb-back/uploads/"
}