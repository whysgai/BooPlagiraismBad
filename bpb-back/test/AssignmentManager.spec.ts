describe("AssignmentManager.ts",() => {

    describe("createAssignment()",()  => {
        it("Should create an assignment if inputs are valid");
    });

    describe("getAssignments()",() => {
        it("Should return assignments if assignments exist");
        it("Should return no assignments if none exist");
    });

    describe("updateAssignment()",()=> {
        it("Should correctly manipulate AssignmentDAO to update an assignment if {id} is valid");
        it("Should throw an appropriate error when trying to update an assignment if {id} is invalid");
    });

    describe("deleteAssignment()",() => {
        it("Should correctly manipulate AssignmentDAO to delete an assignment if {id} is valid");
        it("Should throw an appropriate error when trying to delete an assignment if {id} is invalid");
    });
});
