import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import chaiAsPromised = require("chai-as-promised");
import {AssignmentDAO} from "../src/model/AssignmentDAO";
import { AssignmentManager, IAssignmentManager } from "../src/manager/AssignmentManager";
import { IAssignment, Assignment } from "../src/model/Assignment";

describe("AssignmentManager.ts",() => {

    const testAssignment = new Assignment.builder().build();
    let testAssignmentManager : IAssignmentManager;

    before(() => {
        chai.use(chaiSpies);
        chai.use(chaiAsPromised);
    });

    beforeEach((done) => {
        chai.spy.restore(AssignmentDAO,'createAssignment');
        chai.spy.restore(AssignmentDAO,'readAssignment');
        chai.spy.restore(AssignmentDAO,'readAssignments');
        chai.spy.restore(AssignmentDAO,'updateAssignment');
        chai.spy.restore(AssignmentDAO,'deleteAssignment');
        chai.spy.restore(AssignmentManager,'getAssignments');
        testAssignmentManager = AssignmentManager.getInstance();
        done();
    });

    describe("getInstance",() => {
        it("should always return the same AssignmentManager instance",() => {
            let amA = AssignmentManager.getInstance();
            let amB = AssignmentManager.getInstance();
            expect(amA).to.equal(amB);
        });
    });

    describe("warmCaches()",() => {

        beforeEach(() => {
          testAssignmentManager.invalidateCaches();  
        });

        it("Should warm cache",() => {

            let mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => { return Promise.resolve([testAssignment])});

            return testAssignmentManager.warmCaches().then(() => {
                
                expect(mockReadAssignments).to.have.been.called;

                let mockReadAssignment = chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.resolve(testAssignment)});
                
                return testAssignmentManager.getAssignment(testAssignment.getId()).then(() => {
                    expect(mockReadAssignment).to.not.have.been.called;
                });
            });
        });

        it("Should throw an appropriate error if getting assignments fails when called by warmCaches",() => {
            
            let mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => { return Promise.reject(new Error("readAssignments failed"))});

            return testAssignmentManager.warmCaches().then(() => {
               expect(true,"expected warmCaches to faul, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("readAssignments failed");
            })
        });
    });

    describe("createAssignment()",()  => {
        
        it("Should create an assignment if inputs are valid",() => {

            chai.spy.on(AssignmentDAO,'createAssignment',() => { return Promise.resolve(testAssignment) });

            let createData = {"name":testAssignment.getName()};

            return testAssignmentManager.createAssignment(createData).then((assignment) => {
                expect(assignment.getName()).to.equal(testAssignment.getName());
            });
        });

        it("Should throw an appropriate error if DAO createAssignment fails",() => {
   
            chai.spy.on(AssignmentDAO,'createAssignment',() => { return Promise.reject(new Error("Create failed")) });

            let createData = {"name":testAssignment.getName()};

            return expect(testAssignmentManager.createAssignment(createData)).to.be.rejectedWith("Create failed");        
        });
    });

    describe("invalidateCaches()",() => {

        beforeEach(() => {
            testAssignmentManager.invalidateCaches();
        });

        it("Should clear the cache and reset cache count",() => {
            let mockReadAssignment = chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.resolve(testAssignment)});

            return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignmentMiss) => {
                expect(mockReadAssignment).to.have.been.called.once.with(testAssignment.getId());
                expect(assignmentMiss).to.deep.equal(testAssignment);
                
                return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignmentHit) => {
                    expect(mockReadAssignment).to.have.been.called.once.with(testAssignment.getId());

                    testAssignmentManager.invalidateCaches();

                    return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignmentHit) => {
                        expect(mockReadAssignment).to.have.been.called.twice.with(testAssignment.getId());
                    });
                });
            });
        });
    });

    describe("getAssignment()",() => {

        beforeEach(() => {
            testAssignmentManager.invalidateCaches();
        });

        it("Should return the specified assignment if one exists with the given id",() => {

            let mockReadAssignment = chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.resolve(testAssignment)});

            return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignmentMiss) => {
                expect(mockReadAssignment).to.have.been.called.once.with(testAssignment.getId());
                expect(assignmentMiss).to.deep.equal(testAssignment);
                
                return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignmentHit) => {
                    expect(mockReadAssignment).to.have.been.called.once.with(testAssignment.getId());
                    expect(assignmentHit).to.deep.equal(testAssignment);
                });
            });
        });

        it("Should throw an appropriate error if the specified assignment does not exist",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.reject(new Error("An assignment does not exist with the given id"))});
            
            return testAssignmentManager.getAssignment(testAssignment.getId()).then((assignment) => {
                expect(true, "getAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("An assignment does not exist with the given id")
            });
        });
    })

    describe("getAssignments()",() => {
        
        beforeEach(() => {
            testAssignmentManager.invalidateCaches();
        });

        it("Should not utilise cache to return assignments if assignments exist but are not in cache",() => {
            let mockAssignment = new Assignment.builder().build();
            let expectedAssignments = [testAssignment,mockAssignment];
            let mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

            return testAssignmentManager.getAssignments().then((assignments) => {
                expect(mockReadAssignments).to.have.been.called.once;
                expect(assignments).to.deep.equal(expectedAssignments);
            });
        });

        it("Should use the cache and return assignments if cache contains assignments",() => {
            let mockAssignment = new Assignment.builder().build();
            let expectedAssignments = [testAssignment,mockAssignment];
            let mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

            return testAssignmentManager.getAssignments().then((assignmentsMiss) => {
                expect(mockReadAssignments).to.have.been.called.once;
                expect(assignmentsMiss).to.deep.equal(expectedAssignments);

                return testAssignmentManager.getAssignments().then((assignmentsHit) => {
                    expect(mockReadAssignments).to.have.been.called.once;
                    expect(assignmentsHit).to.deep.equal(expectedAssignments);
                });
            });
        });

        it("Should return no assignments if none exist",() => {
            let expectedAssignments = [] as IAssignment[];
            let mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

            return testAssignmentManager.getAssignments().then((assignments) => {
                expect(mockReadAssignments).to.have.been.called.once;
                expect(assignments).to.deep.equal(expectedAssignments);
            });
        });

        it("Should throw an appropriate error if DAO fails to read assignments",() => {
            chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.reject(new Error("Failed to read assignments"))});
            return expect(testAssignmentManager.getAssignments()).to.eventually.be.rejectedWith("Failed to read assignments");
        })
    });

    describe("updateAssignment()",()=> {

        beforeEach(() => {
            testAssignmentManager.invalidateCaches();
        });

        it("Should correctly manipulate AssignmentDAO to update the specified assignment if {id} is valid",() => {
            let updatedAssignmentBuilder = new Assignment.builder();
            let expectedName = "Updated Name";
            let expectedSubmissionIds = ["Updated","List"];

            updatedAssignmentBuilder.setName(expectedName);
            let updatedAssignment = updatedAssignmentBuilder.build();

            let updateBody ={"name":expectedName}

            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            let mockUpdateAssignment = chai.spy.on(AssignmentDAO,'updateAssignment',(assn) => {return Promise.resolve(assn)}); // Should be updated by method (thus, mock is passthrough)

            return testAssignmentManager.updateAssignment(testAssignment.getId(),updateBody).then((assignment) => {
                expect(mockUpdateAssignment).to.have.been.called.with(testAssignment);
                expect(assignment.getName()).to.equal(updatedAssignment.getName());
            });
        });

        it("Should throw an appropriate error when trying to update the specified assignment if {id} is invalid",() => {
            let updateBody ={"name":"test"}

            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.reject(new Error("Assignment not found"))});
            let mockUpdateAssignment = chai.spy.on(AssignmentDAO,'updateAssignment',() => {return Promise.reject(new Error("Assignment could not be updated"))});

            return testAssignmentManager.updateAssignment(testAssignment.getId(),updateBody).then(() => {
                expect(true, "updateAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Assignment not found");
                expect(mockUpdateAssignment).to.not.have.been.called;
            });;
        });
        it("Should throw an appropriate error when trying to update the specified assignment if update fails",() => {
            let updateBody ={"name":"test"}

            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            let mockUpdateAssignment = chai.spy.on(AssignmentDAO,'updateAssignment',() => {return Promise.reject(new Error("Assignment could not be updated"))});

            return testAssignmentManager.updateAssignment(testAssignment.getId(),updateBody).then(() => {
                expect(true, "updateAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Assignment could not be updated");
                expect(mockUpdateAssignment).to.have.been.called.once;
            });;
        });
    });

    describe("deleteAssignment()",() => {

        it("Should correctly manipulate AssignmentDAO to delete the specified assignment if {id} is valid",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            let mockDeleteAssignment = chai.spy.on(AssignmentDAO,'deleteAssignment',() => {return Promise.resolve()});

            return testAssignmentManager.deleteAssignment(testAssignment.getId()).then(() => {
                expect(mockDeleteAssignment).to.have.been.called.once.with(testAssignment.getId());
            });
        });

        it("Should throw an appropriate error when trying to delete the specified assignment if {id} is invalid",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.reject(new Error("Assignment not found"))});
            let mockDeleteAssignment = chai.spy.on(AssignmentDAO,'deleteAssignment',() => {return Promise.resolve()});
            
            return testAssignmentManager.deleteAssignment(testAssignment.getId()).then(() => {
                expect(true, "deleteAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Assignment not found");
                expect(mockDeleteAssignment).to.not.have.been.called;
            });;
        });

        it("Should throw an appropriate error if DAO fails to delete the specified assignment",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            let mockDeleteAssignment = chai.spy.on(AssignmentDAO,'deleteAssignment',() => {return Promise.reject(new Error("Could not delete assignment"))});

            return testAssignmentManager.deleteAssignment(testAssignment.getId()).then(() => {
                expect(true, "deleteAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Could not delete assignment");
                expect(mockDeleteAssignment).to.not.have.been.called;
            });
        });
    });
});