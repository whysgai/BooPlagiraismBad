
describe("SubmissionManager.ts",() => {

    describe("getSubmissions()",() => {
        
        it("Should return submissions if there are some");

        it("Should return no submissions if there are none");

    });

    describe("createSubmission()",() => {
        
        it("Should properly create a submission if body parameters are correct");

        it("Should return an appropriate error if body parameters are incorrect");

    });

    describe("updateSubmission()",() => {
        
        it("Should properly update a submission if body parameters are correct and {id} exists");

        it("Should return an appropriate error if {id} does not exist");

        it("Should return an appropriate error if body parameters are incorrect but {id} exists");

    });

    describe("addFile()",() =>{

        it("Should save and add a frontend-”encoded” file into the submission specified by the client");

        it("Should return an appropriate error if body parameters are incorrect (submission specified does not exist or is invalid)");

        it("Should return an appropriate error if body parameters are incorrect (submission specified exists, but one or more other parameters is invalid)");
    
    });

    describe("deleteSubmission()",() =>{

        it("Should properly instruct SubmissionDAO to delete a submission if the specified {id} is valid");
        
        it("Should throw an appropriate error if {id} is invalid");
    
    });

    describe("compareSubmission({id_a},{id_b})",()=> {

        it("Should return a valid AnalysisResult if both {id}s are valid");

        it("Should return an appropriate error if {id_a} is valid and {id_b} is not valid");
        
        it("Should return an appropriate error if {id_a} is not valid and {id_b} is valid");
        
        it("Should return an appropriate error if neither ids is valid");

    });
});
