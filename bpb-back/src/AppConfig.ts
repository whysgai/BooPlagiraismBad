/**
 * Provides access to environment configuration information.
 */
export class AppConfig {
   
    /**
     * Returns the configured application port
     */
    public static port() : string {
        return process.env.APIPORT;
    }

    /**
     * Returns the configured database connection string for the app database
     */
    public static dbConnectionString() : string {
        return process.env.DBCONNECTIONSTRING;
    }

    /**
     * Returns the configured maximum size (in bytes) of a single submission file upload
     */
    public static maxFileUploadSize() : number {
        return Number(process.env.MAXFILEUPLOADSIZE);
    }

    public static getComparisonThreshold() : number {
        return Number(process.env.COMPARISONTHRESHOLD);
    }
}