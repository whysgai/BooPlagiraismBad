describe("SubmissionDAO.ts",() => {
    
    describe("createSubmission()",() => {

        it("Should create an submission database object if inputs are valid");
    
        it("Should throw an appropriate error if inputs are invalid");
    });

    describe("readSubmission()",() => {

        it("Should read an submission database object if {id} is valid");
    
        it("Should throw an appropriate error when trying to update a nonexistent database object");
    });

    describe("updateSubmission()",() => {
    
        it("Should update an submission database object if {id} is valid");
    
        it("Should throw an appropriate error if {id} is invaliddeleteSubmission()");
    
        it("Should be able to delete an submission database object");
    
        it("Should throw an appropriate error if {id} is invalid");
    }); 
});