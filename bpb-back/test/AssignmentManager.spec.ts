import { expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import chaiAsPromised = require("chai-as-promised");
import {AssignmentDAO} from "../src/model/AssignmentDAO";
import { AssignmentManager, IAssignmentManager } from "../src/manager/AssignmentManager";
import { IAssignment, Assignment } from "../src/model/Assignment";
import { isAssignment } from "tslint";

describe("AssignmentManager.ts",() => {

    const testAssignment = new Assignment.builder().build();
    let testAssignmentManager : AssignmentManager;

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
        testAssignmentManager = new AssignmentManager();
        done();
    });

    describe("warmCaches()",() => {

        it("Should warm cache",() => {

            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => { return Promise.resolve([testAssignment])});

            return testAssignmentManager.warmCaches().then(() => {
                
                expect(mockReadAssignments).to.have.been.called;

                var mockReadAssignment = chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.resolve(testAssignment)});
                
                return testAssignmentManager.getAssignment(testAssignment.getId()).then(() => {
                    expect(mockReadAssignment).to.not.have.been.called;
                });
            });
        });

        it("Should throw an appropriate error if getting assignments fails when called by warmCaches",() => {
            
            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => { return Promise.reject(new Error("readAssignments failed"))});

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

            var createData = {"name":testAssignment.getName(),"submissionIds":testAssignment.getSubmissionIds()};

            return testAssignmentManager.createAssignment(createData).then((assignment) => {
                expect(assignment.getName()).to.equal(testAssignment.getName());
                expect(assignment.getSubmissionIds()).to.equal(testAssignment.getSubmissionIds());
            });
        });

        it("Should throw an appropriate error if DAO createAssignment fails",() => {
   
            chai.spy.on(AssignmentDAO,'createAssignment',() => { return Promise.reject(new Error("Create failed")) });

            var createData = {"name":testAssignment.getName(),"submissionIds":testAssignment.getSubmissionIds()};

            return expect(testAssignmentManager.createAssignment(createData)).to.be.rejectedWith("Create failed");        
        });
    });

    describe("getAssignment()",() => {

        it("Should return the specified assignment if one exists with the given id",() => {

            var mockReadAssignment = chai.spy.on(AssignmentDAO,'readAssignment',() => { return Promise.resolve(testAssignment)});
            //var mockGetAssignment = chai.spy.on(testAssignmentManager, 'getAssignment', () => { return Promise.resolve(testAssignment) });

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

        it("Should not utilise cache to return assignments if assignments exist but are not in cache",() => {
            var mockAssignment = new Assignment.builder().build();
            var expectedAssignments = [testAssignment,mockAssignment];
            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

            return testAssignmentManager.getAssignments().then((assignments) => {
                expect(mockReadAssignments).to.have.been.called.once;
                expect(assignments).to.deep.equal(expectedAssignments);
            });
        });

        it("Should use the cache and return assignments if cache contains assignments",() => {
            var mockAssignment = new Assignment.builder().build();
            var expectedAssignments = [testAssignment,mockAssignment];
            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

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
            var expectedAssignments = [] as IAssignment[];
            var mockReadAssignments = chai.spy.on(AssignmentDAO,'readAssignments',() => {return Promise.resolve(expectedAssignments)});

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

        it("Should correctly manipulate AssignmentDAO to update the specified assignment if {id} is valid",() => {
            var updatedAssignmentBuilder = new Assignment.builder();
            var expectedName = "Updated Name";
            var expectedSubmissionIds = ["Updated","List"];

            updatedAssignmentBuilder.setSubmissionIds(expectedSubmissionIds);
            updatedAssignmentBuilder.setName(expectedName);
            var updatedAssignment = updatedAssignmentBuilder.build();

            var updateBody ={"name":expectedName,"submissionIds":expectedSubmissionIds}

            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            var mockUpdateAssignment = chai.spy.on(AssignmentDAO,'updateAssignment',(assn) => {return Promise.resolve(assn)}); // Should be updated by method (thus, mock is passthrough)

            return testAssignmentManager.updateAssignment(testAssignment.getId(),updateBody).then((assignment) => {
                expect(mockUpdateAssignment).to.have.been.called.with(testAssignment);
                expect(assignment.getName()).to.equal(updatedAssignment.getName());
                expect(assignment.getSubmissionIds()).to.equal(updatedAssignment.getSubmissionIds());
            });
        });

        it("Should throw an appropriate error when trying to update the specified assignment if {id} is invalid",() => {
            var updateBody ={"name":"test","submissionIds":["test"]}

            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.reject(new Error("Assignment not found"))});
            var mockUpdateAssignment = chai.spy.on(AssignmentDAO,'updateAssignment',() => {return Promise.reject(new Error("Assignment could not be updated"))});

            return testAssignmentManager.updateAssignment(testAssignment.getId(),updateBody).then(() => {
                expect(true, "updateAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Assignment not found");
                expect(mockUpdateAssignment).to.not.have.been.called;
            });;
        });
        it("Should throw an appropriate error when trying to update the specified assignment if update fails",() => {
            var updateBody ={"name":"test","submissionIds":["test"]}

            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            var mockUpdateAssignment = chai.spy.on(AssignmentDAO,'updateAssignment',() => {return Promise.reject(new Error("Assignment could not be updated"))});

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
            var mockDeleteAssignment = chai.spy.on(AssignmentDAO,'deleteAssignment',() => {return Promise.resolve()});

            return testAssignmentManager.deleteAssignment(testAssignment.getId()).then(() => {
                expect(mockDeleteAssignment).to.have.been.called.once.with(testAssignment.getId());
            });
        });

        it("Should throw an appropriate error when trying to delete the specified assignment if {id} is invalid",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.reject(new Error("Assignment not found"))});
            var mockDeleteAssignment = chai.spy.on(AssignmentDAO,'deleteAssignment',() => {return Promise.resolve()});
            
            return testAssignmentManager.deleteAssignment(testAssignment.getId()).then(() => {
                expect(true, "deleteAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Assignment not found");
                expect(mockDeleteAssignment).to.not.have.been.called;
            });;
        });

        it("Should throw an appropriate error if DAO fails to delete the specified assignment",() => {
            chai.spy.on(AssignmentDAO,'readAssignment',() => {return Promise.resolve(testAssignment)});
            var mockDeleteAssignment = chai.spy.on(AssignmentDAO,'deleteAssignment',() => {return Promise.reject(new Error("Could not delete assignment"))});

            return testAssignmentManager.deleteAssignment(testAssignment.getId()).then(() => {
                expect(true, "deleteAssignment should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Could not delete assignment");
                expect(mockDeleteAssignment).to.not.have.been.called;
            });
        });
    });
});