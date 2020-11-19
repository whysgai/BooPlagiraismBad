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

    public static printEnv() : void {
        console.log("PORT: " + this.port());
        console.log("UPLOAD DIR: " + this.submissionFileUploadDirectory());
        console.log("DB Connection string: " + this.dbConnectionString());
    }
}