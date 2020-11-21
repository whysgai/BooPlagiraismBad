/**
 * Provides access to environment configuration information.
 */
export class AppConfig {
   
    public static port() : string {
        return process.env.APIPORT;
    }
    
    public static submissionFileUploadDirectory() : string {
        return process.env.UPLOADDIRECTORY;
    }

    public static dbConnectionString() : string {
        return process.env.DBCONNECTIONSTRING;
    }
}