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

    /**
     * Returns the configured comparison threshold for individual subtree element comparisons
     */
    public static comparisonThreshold() : number {
        return Number(process.env.COMPARISONTHRESHOLD);
    }

    /**
     * Returns the configured maximum number of matches to be shown in the comparison view at a given time
     * Note: The n largest (longest) matches will be returned
     */
    public static maxMatchesPerFile() : number {
        return Number(process.env.MAXMATCHESPERFILE);
    
    }

    /**
     * Excludes specific (overly large) subtree context types from being returned for visualization 
     */
    public static excludedContextTypes() : string[] {
        return ["compilationUnit","typeDeclaration","classBody","classBodyDeclaration"];
    }
}