describe("AssignmentDAO.ts",() => {

    describe("createAssignment()",() => {
        it("Should create an assignment database object if inputs are valid");
        it("Should throw an appropriate error if inputs are invalid");
    });

    describe("readAssignment()",() => {
        it("Should read an assignment database object if {id} is valid");
        it("Should throw an appropriate error when trying to update a nonexistent database object");
    });   
        
    describe("updateAssignment()",() => {
        it("Should update an assignment database object if {id} is valid");
        it("Should throw an appropriate error if {id} is invalid");
    });

    describe("deleteAssignment()",() => {
        it("Should be able to delete an assignment database object");
        it("Should throw an appropriate error if {id} is invalid");
    });
});
