export class AppConfig {
   
    public static appName() : string {
        return "bpb-back";
    }

    public static port() : string {
        return process.env.PORT;
    }

    public static submissionFileUploadDirectory() : string {
        return process.env.UPLOADDIRECTORY;
    }

    public static dbConnectionString() : string {
        return process.env.DBCONNECTIONSTRING;
    }
}