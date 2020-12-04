import { assert, expect } from "chai";
import chai = require("chai");
import chaiSpies = require("chai-spies");
import chaiAsPromised = require("chai-as-promised");
import { SubmissionDAO } from "../src/model/SubmissionDAO";
import { ComparisonCache, ISubmissionManager, SubmissionManager } from "../src/manager/SubmissionManager";
import { ISubmission, Submission } from "../src/model/Submission";
import SubmissionData from "../src/types/SubmissionData"
import { AnalysisResultEntry, IAnalysisResultEntry } from "../src/model/AnalysisResultEntry";
import { AnalysisResult } from "../src/model/AnalysisResult";
import fs from 'fs';
import { mock } from "sinon";

describe("SubmissionManager.ts",() => {

    var testSubmissionManager : ISubmissionManager;
    var testSubmission : ISubmission;
    var testSubmissionId : string;
    var testSubmissionName : string;
    var testSubmissionAssignmentId : string;
    var testFileName : string;
    var testFilePath : string;

    before(()=>{
        chai.use(chaiSpies);
        chai.use(chaiAsPromised);
        testSubmissionName = "testname";
        testSubmissionAssignmentId = "test_aid";
        testFileName = "javaExample.java";
        testFilePath = "/vagrant/bpb-back/test/res/javaExample.java"; //Must be full path :(
    });

    beforeEach((done)=>{
        chai.spy.restore(SubmissionDAO,'createSubmission');
        chai.spy.restore(SubmissionDAO,'readSubmission');
        chai.spy.restore(SubmissionDAO,'readSubmissions');
        chai.spy.restore(SubmissionDAO,'updateSubmission');
        chai.spy.restore(SubmissionDAO,'deleteSubmission');

        var testSubmissionBuilder = new Submission.builder();
        testSubmissionBuilder.setName(testSubmissionName);
        testSubmissionBuilder.setAssignmentId(testSubmissionAssignmentId);
        testSubmission = testSubmissionBuilder.build();
        testSubmissionId = testSubmission.getId()

        done();
    });

    describe("ComparisonCache", () => {
        var testComparisonCache : ComparisonCache;
        var submissionIdA : string;
        var submissionIdB : string;
        var analysisResults : AnalysisResult[];
        var analysisResultEntries : IAnalysisResultEntry[][];
        
        before(() => {
            submissionIdA = 'abcd';
            submissionIdB = 'efgh';
            let entryA = new AnalysisResultEntry('1', submissionIdA, '3', '4', 5, 6, 7, 8, '9', '10');
            let entryB = new AnalysisResultEntry('11', submissionIdB, '13', '14', 15, 16, 17, 18, '19', '20');
            analysisResultEntries = new Array<IAnalysisResultEntry[]>();
            analysisResultEntries.push([entryA, entryB]);
            analysisResults = [new AnalysisResult(analysisResultEntries, 3, submissionIdA, submissionIdB, 'fileA', 'fileB')];
        });

        beforeEach(() => {
            testComparisonCache = new ComparisonCache();
        });

        it("Should be able to load a comparison of two submissions", () => {
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
        });

        it("get() should return undefined if no entries have been loaded", () => {
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.undefined;
        });

        it("get() should return undefined if no entries have been loaded under one of the provided id's", () => {
            let unloadedId = 'someOtherId';
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, unloadedId)).to.be.undefined;
            expect(testComparisonCache.get(unloadedId, submissionIdA)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdB, unloadedId)).to.be.undefined;
            expect(testComparisonCache.get(unloadedId, submissionIdB)).to.be.undefined;            
        });

        it("Calling set() again with same parameters should replace the initial set.", () => {
            let newAnalysisResults = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile')];
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
            
            testComparisonCache.set(submissionIdA, submissionIdB, newAnalysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(newAnalysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(newAnalysisResults);
        });

        it("Calling set() again with parameters flipped should replace the initial set.", () => {
            let newAnalysisResults = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile')];
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
            
            testComparisonCache.set(submissionIdB, submissionIdA, newAnalysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(newAnalysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(newAnalysisResults);
        });

        it("delete(submissionIdA) should remove the entry from the cache", () => {
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
            testComparisonCache.delete(submissionIdA);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.undefined;
        });

        
        it("delete(submissionIdB) should remove the entry from the cache", () => {
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
            testComparisonCache.delete(submissionIdB);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.undefined;
        });

        it("delete(submissionId) should remove the entries associated with that Id from the cache", () => {
            let submissionIdC = 'ijkl';
            let newAnalysisResultsA = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile')];
            let newAnalysisResultsB = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile')];
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            testComparisonCache.set(submissionIdA, submissionIdC, newAnalysisResultsA);
            testComparisonCache.set(submissionIdB, submissionIdC, newAnalysisResultsB);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdC)).to.be.equal(newAnalysisResultsA);
            expect(testComparisonCache.get(submissionIdC, submissionIdA)).to.be.equal(newAnalysisResultsA);
            expect(testComparisonCache.get(submissionIdB, submissionIdC)).to.be.equal(newAnalysisResultsB);
            expect(testComparisonCache.get(submissionIdC, submissionIdB)).to.be.equal(newAnalysisResultsB);
            testComparisonCache.delete(submissionIdA);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdA, submissionIdC)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdC, submissionIdA)).to.be.undefined;
            expect(testComparisonCache.get(submissionIdB, submissionIdC)).to.be.equal(newAnalysisResultsB);
            expect(testComparisonCache.get(submissionIdC, submissionIdB)).to.be.equal(newAnalysisResultsB);
        });
        
    });

    describe("getSubmission()",() => {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });
        
        it("Should return submission if the provided ID is valid",()=> {
            var mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.resolve(testSubmission)});

            //Initial query accesses DAO and returns mock
            return testSubmissionManager.getSubmission(testSubmissionId).then((submission) => {
                expect(submission).to.deep.equal(testSubmission);
                expect(mockReadSubmission).to.have.been.called.once.with(testSubmissionId);

                //Second query uses cache (doesn't access DAO)
                return testSubmissionManager.getSubmission(testSubmissionId).then((submission2) => {
                    expect(submission2).to.deep.equal(testSubmission);
                    expect(mockReadSubmission).to.have.been.called.once; // Cache is used
                });
            });
        });

        it("Should throw an error if there is no submission with the provided ID",() =>{
            
            var mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.reject(new Error("No submission exists with id"))});
            
            return testSubmissionManager.getSubmission("some_nonexistent_id").then((submission) => {
                expect(true,"getSubmission is succeeding where it should fail (should not find submission with nonexistent id)").to.equal(false);
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.contains("No submission exists with id");
            });
        });
    });
    describe("getSubmissions()",() => {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });
        
        it("Should return submissions of the given assignment if there are some",()=> {
            var mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() =>{return Promise.resolve([testSubmission])});
            let mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.resolve(testSubmission)});

            //First call pulls from database, since cache is empty
            return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissions) => {
                expect(submissions[0]).to.deep.equal(testSubmission);
                expect(mockReadSubmissions).to.have.been.called.with(testSubmissionAssignmentId);
                expect(mockReadSubmissions).to.have.been.called.once;

                //submissions should be cached, so second call should not call readSubmission again
                return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissions) => {
                    expect(submissions[0]).to.deep.equal(testSubmission);
                    expect(mockReadSubmissions).to.have.been.called.once;

                    //submission contained in array returned by getSubmissions should be cached in submissionCache
                    return testSubmissionManager.getSubmission(testSubmissionId).then((submission) => {
                        expect(submission).to.be.equal(submissions[0]);
                        expect(mockReadSubmission).to.not.have.been.called;//Should have been loaded into the cache by getSubmissions
                    });
                });
            });
        });

        it("Should populate submissionCache.get(submissionId) after pulling from database.", () => {
            testSubmissionManager = new SubmissionManager();
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() =>{return Promise.resolve([testSubmission])});
            let mockReadSubmission = chai.spy.on(SubmissionDAO, 'readSubmission', () =>{return Promise.resolve(testSubmission)});

            //First call pulls from database, since cache is empty
            return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissions) => {
                expect(submissions[0]).to.deep.equal(testSubmission);
                expect(mockReadSubmissions).to.have.been.called.with(testSubmissionAssignmentId);
                expect(mockReadSubmissions).to.have.been.called.once;
                expect(mockReadSubmission).to.not.have.been.called;
                
                //Since getSubmissions(assignmentId) should populate both cache's, this should not call readSubmission(submissionId)
                return testSubmissionManager.getSubmission(testSubmission.getId()).then((submission) => {
                    expect(submission).to.deep.equal(testSubmission);
                    expect(mockReadSubmission).to.not.have.been.called;
                    expect(mockReadSubmissions).to.have.been.called.once;
                });
            });
        });

        it("Should return no submissions if there are none",() =>{
            chai.spy.on(SubmissionDAO,'readSubmissions',() =>{return Promise.resolve([])});
            expect(testSubmissionManager.getSubmissions(testSubmissionAssignmentId)).to.eventually.be.fulfilled.with.an("array").that.is.empty;
        });     
        
         it("Should throw an appropriate error if DAO read fails",() =>{
            chai.spy.on(SubmissionDAO,'readSubmissions',() =>{return Promise.reject(new Error("Read failed"))});
            
            return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissions) => {
                expect(true,"getSubmissions should have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Read failed");
            })
        });     
    });

    describe("createSubmission()",() => {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });
        
        it("Should properly create a submission if body parameters are correct (includes name, assignment_id)",() => {
            
            chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
            var createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}

            return testSubmissionManager.createSubmission(createBody).then((submission) => {
                expect(submission.getName()).to.equal(testSubmission.getName());
                expect(submission.getAssignmentId()).to.equal(testSubmission.getAssignmentId());
            });
        });

        describe(" createSubmission/getSubmission Cache tests", () => {

            before(() => {
                testSubmissionManager = new SubmissionManager();
            })

            it("Should properly cache the submission in submissionCache",() => {
                chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
                let mockReadSubmission = chai.spy.on(SubmissionDAO, 'readSubmission', () => {return Promise.resolve(testSubmission)});
                var createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
    
                return testSubmissionManager.createSubmission(createBody).then((submission) => {
                    return testSubmissionManager.getSubmission(submission.getId()).then((fetchedSubmission) => {
                        expect(fetchedSubmission).to.be.equal(submission);
                        expect(mockReadSubmission).to.not.have.been.called; //Should not have been called if retreived from cache.
                    });
                });
            });

            it("Should not update the submissionCacheByAssignment if it is empty", () => {
                chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
                let mockReadSubmissions = chai.spy.on(SubmissionDAO, 'readSubmissions',() => {return Promise.resolve([testSubmission])});
                var createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
    
                return testSubmissionManager.createSubmission(createBody).then((submission) => {
                    return testSubmissionManager.getSubmissions(testSubmission.getAssignmentId()).then((submissionsFromRead) => {
                        expect(submissionsFromRead[0]).to.deep.equal(submission);
                        expect(mockReadSubmissions).to.have.been.called.once; //should have been called since the submissionCacheByAssignment was empty
                    });
                });
            });

            it("Should update the submissionCacheByAssignment if it is not empty and contains a submission with a matching assignmentId", () => {
                chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
                let mockReadSubmissions = chai.spy.on(SubmissionDAO, 'readSubmissions',() => {return Promise.resolve([testSubmission])});
                var createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
                
                return testSubmissionManager.createSubmission(createBody).then((submission) => {
                    return testSubmissionManager.getSubmissions(testSubmission.getAssignmentId()).then((submissionsFromRead1) => {
                        expect(mockReadSubmissions).to.have.been.called.once; //should have been called since the submissionCacheByAssignment was empty
                        expect(submissionsFromRead1[0]).to.be.deep.equal(submission);

                        return testSubmissionManager.createSubmission(createBody).then((submissionCreated) => {
                            return testSubmissionManager.getSubmissions(submissionCreated.getAssignmentId()).then((submissionsFromRead2) => {
                                expect(mockReadSubmissions).to.have.been.called.once; //should not have been called again since the submissionCacheByAssignment was not empty
                                expect(submissionsFromRead2[0]).to.be.equal(submission);
                            });
                        });
                    });
                });
            });

            
            it("Should not update the submissionCacheByAssignment if it is not empty and does not a submission with a matching assignmentId", () => {
                chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
                let mockReadSubmissions = chai.spy.on(SubmissionDAO, 'readSubmissions',() => {return Promise.resolve([testSubmission])});
                var createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
                var createBody2 : SubmissionData = {name:testSubmission.getName(),assignment_id:'a different assignment Id'}
                
                return testSubmissionManager.createSubmission(createBody).then((submission) => {
                    return testSubmissionManager.getSubmissions(testSubmission.getAssignmentId()).then((submissionsFromRead1) => {
                        expect(mockReadSubmissions).to.have.been.called.once; //should have been called since the submissionCacheByAssignment was empty
                        expect(submissionsFromRead1[0]).to.be.deep.equal(submission);

                        return testSubmissionManager.createSubmission(createBody2).then((submissionCreated) => {
                            return testSubmissionManager.getSubmissions(submissionCreated.getAssignmentId()).then((submissionsFromRead2) => {
                                expect(mockReadSubmissions).to.have.been.called.once; //have been called again since the submissionCacheByAssignment did not contain this assignment
                                expect(submissionsFromRead2[0]).to.be.equal(submission);
                            });
                        });
                    });
                });
            });
        });


        it("Should throw an appropriate error if DAO fails to create a submission",() => {
            chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.reject(new Error("Failed to create"))});

            var createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId};
            
            return testSubmissionManager.createSubmission(createBody).then(() => {
                expect(true,"createSubmission should fail, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Failed to create");
            })
        });
    });

    describe("updateSubmission()",() => {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });
        
        it("Should properly update a submission if body parameters are included and submission exists with id",() => {
                        
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',(submission) => {return Promise.resolve(submission)}); //Pass through

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";

            var updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(submission.getName()).to.equal(expectedNewName);
                expect(submission.getAssignmentId()).to.equal(expectedNewAssnId);
                expect(submission.getId()).to.equal(testSubmission.getId());
            });
        });

        it("Should properly update a submission if submission exists and only one new body parameter is provided (name)",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',(submission) => {return Promise.resolve(submission)}); //Pass through

            var expectedNewName = "test";

            var updateBody : SubmissionData = {name:expectedNewName, assignment_id: testSubmission.getAssignmentId()};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(submission.getName()).to.equal(expectedNewName);
                expect(submission.getAssignmentId()).to.equal(testSubmissionAssignmentId);
                expect(submission.getId()).to.equal(testSubmission.getId());
            });
        });

        it("Should properly update a submission if submission exists and only one new body parameter is provided (assignment_id)",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',(submission) => {return Promise.resolve(submission)}); //Pass-through updated submission

            var expectedNewAssnId = "test2";

            var updateBody : SubmissionData = {name: testSubmission.getName(), assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(submission.getName()).to.equal(testSubmissionName);
                expect(submission.getAssignmentId()).to.equal(expectedNewAssnId);
                expect(submission.getId()).to.equal(testSubmission.getId());
            });
        });
        
        it("Should return an appropriate error if submission doesn't exist with the provided id",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.reject(new Error("Submission does not exist"))});
            chai.spy.on(SubmissionDAO,'updateSubmission');

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";

            var updateBody : SubmissionData = {name:expectedNewName,assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(true,"updateSubmission is succeeding where it should fail (no submission exists with submission id)").to.equal(false);
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.contains("Submission does not exist");
            });
        });

        it("Should return an appropriate error if DAO fails to update the submission",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',() => {return Promise.reject(new Error("updateSubmission failed"))});

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";

            var updateBody : SubmissionData = {name:expectedNewName,assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(true,"updateSubmission is succeeding where it should fail (updateSubmission should fail)").to.equal(false);
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.contains("updateSubmission failed");
            });
        });

        it("Should properly cache a submission",() => {
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() => {return Promise.resolve([testSubmission])});            
            let mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',() => {return Promise.resolve(testSubmission)}); //Pass through

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";

            var updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};

            //initial call to update
            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission1) => {
                expect(submission1.getName()).to.equal(expectedNewName);
                expect(submission1.getAssignmentId()).to.equal(expectedNewAssnId);
                expect(submission1.getId()).to.equal(testSubmission.getId());
                
                //call to getSubmission should find in cache
                return testSubmissionManager.getSubmission(submission1.getId()).then((submission2) => {
                    expect(submission2).to.equal(submission1);
                    expect(mockReadSubmission).to.not.have.been.called;

                    // submissionCacheByAssignment should not be populated yet, should fetch from database
                    return testSubmissionManager.getSubmissions(submission2.getId()).then((submission3) => {
                        expect(submission3[0]).to.deep.equal(submission1);
                        expect(mockReadSubmissions).to.have.been.called.once;

                        //second call to update
                        let newExpectedNewName = 'thisIsANewName';
                        let newUpdateBody = {name:newExpectedNewName,assignment_id:expectedNewAssnId};
                        return testSubmissionManager.updateSubmission(testSubmission.getId(), newUpdateBody).then((submission4) => {
                            expect(submission4.getName()).to.equal(newExpectedNewName);

                            // second update call should have updated the submissionCacheByAssignment
                            return testSubmissionManager.getSubmissions(submission4.getAssignmentId()).then((submission5) => {
                                expect(submission5[0].getName()).to.equal(newExpectedNewName);
                                expect(mockReadSubmissions).to.not.have.been.called; // should have pulled from cache
                            });
                        });
                    });
                });
            });
        });

        it("Should update the submissionCacheByAssignment if it is not empty", () => {
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() => {return Promise.resolve([testSubmission])});
            chai.spy.on(SubmissionDAO,'updateSubmission',() => {return Promise.resolve(testSubmission)}); //Pass through

            var expectedNewName = "test";
            var expectedNewAssnId = testSubmissionAssignmentId;
            var updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};
            
            return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissionArr) => {
                expect(mockReadSubmissions).to.have.been.called.once;
                return testSubmissionManager.updateSubmission(testSubmissionId, updateBody).then((updatedSubmission) => {
                    return testSubmissionManager.getSubmissions(updatedSubmission.getAssignmentId()).then((fromCacheArr) => {
                        expect(mockReadSubmissions).to.have.been.called.once; //should come from cache
                        expect(fromCacheArr[0].getName()).to.be.deep.equal(expectedNewName);
                    });
                });
            });
        });

        it("Should not update the a submission in submissionCacheByAssignment if it is empty", () => {
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() => {return Promise.resolve([testSubmission])});
            chai.spy.on(SubmissionDAO, 'readSubmission', () => {return Promise.resolve(testSubmission)})
            chai.spy.on(SubmissionDAO,'updateSubmission',() => {return Promise.resolve(testSubmission)}); //Pass through

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";
            var updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmissionId, updateBody).then((updatedSubmission) => {
                return testSubmissionManager.getSubmissions(updatedSubmission.getAssignmentId()).then((fromCacheArr) => {
                    expect(mockReadSubmissions).to.have.been.called.once; //not cached
                    expect(fromCacheArr[0].getName()).to.be.deep.equal(expectedNewName);
                });
            });
        });

        it("Should not remove from submissionCacheByAssignment if no submissions matching the original assignmentId are held", () => {
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() => {return Promise.resolve([testSubmission])});
            chai.spy.on(SubmissionDAO, 'readSubmission', () => {return Promise.resolve(testSubmission)})
            chai.spy.on(SubmissionDAO,'updateSubmission',() => {return Promise.resolve(testSubmission)}); //Pass through

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";
            var updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};
            
            return testSubmissionManager.updateSubmission(testSubmissionId, updateBody).then((updatedSubmission) => {
                return testSubmissionManager.getSubmissions(testSubmission.getAssignmentId()).then((fromCacheArr) => {
                    expect(mockReadSubmissions).to.have.been.called.exactly(1); //should come from cache
                    expect(fromCacheArr[0].getName()).to.be.deep.equal(expectedNewName);
                });
            });
        });

        it("Should not add to submissionCacheByAssignment if no submissions matching the new assignmentId are held", () => {
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() => {return Promise.resolve([testSubmission])});
            chai.spy.on(SubmissionDAO,'updateSubmission',() => {return Promise.resolve(testSubmission)}); //Pass through

            var expectedNewName = "test";
            var expectedNewAssnId = "test2";
            var updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};
            
            return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissionArr) => {
                expect(mockReadSubmissions).to.have.been.called.once;
                return testSubmissionManager.updateSubmission(testSubmissionId, updateBody).then((updatedSubmission) => {
                    return testSubmissionManager.getSubmissions(updatedSubmission.getAssignmentId()).then((fromCacheArr) => {
                        expect(mockReadSubmissions).to.have.been.called.twice; //should not have been cached
                        expect(fromCacheArr[0].getName()).to.be.deep.equal(expectedNewName);

                        return testSubmissionManager.getSubmissions(testSubmission.getAssignmentId()).then(() => {
                            expect(mockReadSubmissions).to.have.been.called.exactly(2); //should have been deleted from cache
                        });
                    });
                });
            });
        });

    });

    describe("processSubmissionFile()",() => {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });

        it("Should save and add a file into the submission specified by the client",() => {

            var mockSubmission = new Submission.builder().build();

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(mockSubmission)});
            var mockUpdateSubmission = chai.spy.on(SubmissionDAO,'updateSubmission',() =>{return Promise.resolve(mockSubmission)}); //Required

            var mockAddFile = chai.spy.on(mockSubmission,'addFile',() => { return Promise.resolve() });
            var expectedContent = 'HOT CONTENT';
            
            testSubmissionManager.processSubmissionFile(mockSubmission.getId(),testFileName, expectedContent).then(() => {
                expect(mockAddFile).to.have.been.called.with(expectedContent,testFileName);
                expect(mockUpdateSubmission).to.have.been.called.with(mockSubmission);
            });
        });

        it("Should return an appropriate error if file was already added to the submission",() => {
            
            var mockSubmission = new Submission.builder().build();
            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1","tset",testFileName,"test",1,1,2,2,"test","Test"));

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(testSubmission)});
            var mockUpdate = chai.spy.on(SubmissionDAO,'updateSubmission',() =>{ return Promise.resolve(testSubmission)}); //Required
            
            chai.spy.on(testSubmission,'addFile',() => {return Promise.reject(new Error("Submission file " + testFileName + " was already added to the submission"))});
            var expectedContent = 'HOT CONTENT';
        
            return testSubmissionManager.processSubmissionFile(mockSubmission.getId(),testFileName, expectedContent).then(() => {
                expect(true,"processSubmissionFile is succeeding where it should fail (file name was already added)").to.equal(false);
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("Submission file " + testFileName + " was already added to the submission");
                expect(mockUpdate).to.not.have.been.called;
            });
        });

        it("Should return an appropriate error if submission ID is invalid",() => {
            
            var mockSubmission = new Submission.builder().build();
            
            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.reject(new Error("Submission does not exist"))});
            var mockUpdate = chai.spy.on(SubmissionDAO,'updateSubmission',() =>{return Promise.resolve(testSubmission)}); //Required
            var mockAddFile = chai.spy.on(testSubmission,'addFile');
            let expectedContent = 'HOT CONTENT';
            return testSubmissionManager.processSubmissionFile(mockSubmission.getId(),testFileName, expectedContent).then(() => {
                expect(true,"processSubmissionFile is succeeding where it should fail (submission doesn't exist with id)").to.equal(false);
            }).catch((err) => {
                expect(mockAddFile).to.not.have.been.called;
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("Submission does not exist");
                expect(mockUpdate).to.not.have.been.called;
            });
        });

        it("Should return an appropriate error if DAO fails to update the submission",() => {

            var mockSubmission = new Submission.builder().build();
            
            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',() =>{return Promise.reject(new Error("Failed to update"))}); 
            chai.spy.on(testSubmission,'addFile',() => { return Promise.resolve() });
            let expectedContent = 'HOT CONTENT';                        
            return testSubmissionManager.processSubmissionFile(mockSubmission.getId(),testFileName, expectedContent).then(() => {
                expect(true,"processSubmissionFile should have failed (DAO should have returned mock error), but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Failed to update");
            });
        });

        it("Should update caches as appropriate when a submissionFile is processed", () => {
            let newContent = fs.readFileSync('/vagrant/bpb-back/test/res/javaExample.java').toString();
            let mockReadSubmission = chai.spy.on(SubmissionDAO, 'readSubmission', (submissionId) => {
                if (submissionId === testSubmissionId) {
                    return Promise.resolve(testSubmission);
                } else {
                    return Promise.resolve(testSubmission2);
                }
            });
            
            //Load AnalysisEntries so we can run compare
            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1",testSubmission.getId(),'fileName',"test",1,2,1,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e"));
            let updatedModel = testSubmission.getModelInstance()
            let updatedFileContents = new Map<string, string>().set(testFileName, newContent);
            updatedModel.fileContents = [...updatedFileContents];
            updatedModel._id = testSubmissionId;
            updatedModel.entries = [['fileName', [new AnalysisResultEntry("are1",testSubmission.getId(),'fileName',"test",1,2,1,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e")]]];
            let updatedTestSubmission = new Submission.builder().buildFromExisting(updatedModel);
            var testSubmission2 = new Submission.builder().build(); 
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are2",testSubmission2.getId(),'anotherFileName',"test2",1,1,2,2,"890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","e"));
            testSubmission2.addFile('anotherFileName', newContent); 
            
            let mockReadSubmissions = chai.spy.on(SubmissionDAO, 'readSubmissions', () => {return Promise.resolve([testSubmission])});
            let mockUpdateSubmissions = chai.spy.on(SubmissionDAO, 'updateSubmission', () => {return Promise.resolve(updatedTestSubmission)});
            let mockGetSubmission = chai.spy.on(testSubmissionManager, 'getSubmission');
            var mockCompare = chai.spy.on(testSubmission,'compare', () => {return new Array<AnalysisResult>()});

            return testSubmissionManager.compareSubmissions(testSubmission.getId(), testSubmission2.getId()).then((analysisResults) => {
                expect(mockCompare).to.have.been.called.once; //cache is empty
                expect(mockGetSubmission).to.have.been.called.twice;

                return testSubmissionManager.compareSubmissions(testSubmission.getId(), testSubmission2.getId()).then((analysisResults) => {
                    expect(mockCompare).to.have.been.called.once; //cache is loaded, no compare made again
                    
                    return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissionArray) => { //should cache testSubmission
                        expect(mockReadSubmissions).to.have.been.called.once;
                        expect(submissionArray.length).to.be.equal(1);
                        expect(submissionArray[0].getName()).to.be.equal(testSubmissionName);
                        expect(submissionArray[0].getFileContents()).to.be.deep.equal(new Map<string, string>());

                        return testSubmissionManager.processSubmissionFile(testSubmissionId, testFileName, newContent).then(() => {
                            expect(mockReadSubmission).to.have.been.called.twice; // called by update submission in proccess call
                            expect(mockUpdateSubmissions).to.have.been.called.once;
                            expect(testSubmission.getFileContents()).to.be.deep.equal(updatedFileContents);

                            return testSubmissionManager.getSubmission(testSubmissionId).then((modifiedSubmission) => {
                                expect(mockReadSubmission).to.have.been.called.twice; //should still be cached
                                expect(modifiedSubmission.getFileContents()).to.be.deep.equal(updatedFileContents);
                                expect(modifiedSubmission.getFileContents().get(testFileName)).to.be.deep.equal(newContent);
                                
                                return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((modifiedSubArray) => {
                                    expect(mockReadSubmissions).to.have.been.called.once; //Should still be cached
                                    expect(modifiedSubArray[0].getFileContents()).to.be.deep.equal(updatedFileContents);
                                    expect(modifiedSubArray[0].getFileContents().get(testFileName)).to.be.deep.equal(newContent);
                                    
                                    return testSubmissionManager.compareSubmissions(testSubmission.getId(), testSubmission2.getId()).then((analysisResults) => { 
                                        expect(mockCompare).to.have.been.called.once; //cache should have been cleared, should need to call compare again
                                        expect(analysisResults[0].getFiles().get(testSubmission.getId())).to.be.deep.equal('fileName');                     
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe("deleteSubmission({id})",() => {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });

        it("Should properly instruct SubmissionDAO to delete a submission if the specified {id} is valid",() =>{
            
            chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.resolve(testSubmission)});

            var mockDeleteSubmission = chai.spy.on(SubmissionDAO,'deleteSubmission',() => {return Promise.resolve(testSubmission)}); 
            
            return testSubmissionManager.deleteSubmission(testSubmissionId).then(() => {
                expect(mockDeleteSubmission).to.have.been.called.with(testSubmissionId);
            });
        });

        it("Should throw an error if there is no submission with the provided ID",() =>{
            
            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.reject(new Error("No submission exists with id"))});
            var mockDeleteSubmission = chai.spy.on(SubmissionDAO,'deleteSubmission',() => {}); 
            
            return testSubmissionManager.deleteSubmission("some_nonexistent_id").then((submission) => {
                expect(true,"deleteSubmission is succeeding where it should fail (should not find submission with nonexistent id)").to.equal(false);
            }).catch((err) => {
                expect(mockDeleteSubmission).to.not.have.been.called;
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("No submission exists with id");
            });
        });

        it("Should throw an error if the DAO fails to delete the specified submission",() =>{
            
            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(testSubmission)});
            var mockDeleteSubmission = chai.spy.on(SubmissionDAO,'deleteSubmission',() => {return Promise.reject(new Error("Delete failed"))}); 
            
            return testSubmissionManager.deleteSubmission("some_nonexistent_id").then((submission) => {
                expect(true,"deleteSubmission is succeeding where it should fail (DAO deletion failed)").to.equal(false);
            }).catch((err) => {
                expect(mockDeleteSubmission).to.have.been.called;
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("Delete failed");
            });
        });

        it("Should properly modify caches as appropriate when a submission is deleted.", () => {
        let mockGetSubmission = chai.spy.on(testSubmissionManager, 'getSubmission');
        let mockReadSubmissions = chai.spy.on(SubmissionDAO, 'readSubmissions', () => {return Promise.resolve([newSubmission, testSubmission])});
        let mockReadSubmission = chai.spy.on(SubmissionDAO, 'readSubmission', (subId) => {
            if(subId === testSubmissionId) {
                return Promise.resolve(testSubmission);
            } else {
                return Promise.resolve(newSubmission)}
            });
        chai.spy.on(SubmissionDAO, 'deleteSubmission', () => {return Promise.resolve()})
            
            let builder = new Submission.builder();
            builder.setAssignmentId(testSubmissionAssignmentId);
            builder.setName('pablo escobar');
            let newSubmission = builder.build();
            
            
            return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissionArray) => {
                expect(mockReadSubmissions).to.have.been.called.once;
                expect(mockReadSubmissions).to.have.been.called.with(testSubmissionAssignmentId);
                expect(submissionArray.length).to.be.equal(2);
                expect(submissionArray[0].getName()).to.be.deep.equal(newSubmission.getName());
                expect(submissionArray[1].getName()).to.be.deep.equal(testSubmissionName);

                return testSubmissionManager.deleteSubmission(testSubmissionId).then(() => {
                    expect(mockGetSubmission).to.have.been.called.once; //delete checks for submission in database before deleting

                   return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissionArray2) => {
                        expect(mockReadSubmissions).to.have.been.called.once; //should have been cached
                        expect(submissionArray2.length).to.be.equal(1); //should have removed the testSubmission
                        expect(submissionArray2[0].getName()).to.be.deep.equal(newSubmission.getName());

                        return testSubmissionManager.getSubmission(newSubmission.getId()).then((submission) => {
                            expect(mockReadSubmission).to.not.have.been.called(); //should have been cached
                            expect(submission.getName()).to.be.deep.equal(newSubmission.getName());

                            return testSubmissionManager.getSubmission(testSubmissionId).then((submission) => {
                                expect(mockReadSubmission).to.have.been.called.once; //not cached, tries to retrieve
                            });
                        });
                    });
                });
            });
        });
    });

    describe("compareSubmission({id_a},{id_b})",()=> {

        beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });

        it("Should return a valid AnalysisResult if both submissions are valid",() => {
            
            var testSubmission2 = new Submission.builder().build(); 

            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1",testSubmission.getId(),"test","test",1,2,1,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e"));
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are2",'otherID',testSubmission2.getId(),"test2",1,1,2,2,"890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","e"));
            
            var mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
                return new Promise((resolve,reject) => {
                    if(submissionId === testSubmission.getId()) {
                        resolve(testSubmission);
                    } else {
                        resolve(testSubmission2);
                    }
                });
            });

            //Performs Comparison
            return testSubmissionManager.compareSubmissions(testSubmission2.getId(),testSubmission.getId()).then((analysisResult) => {
                expect(analysisResult).to.not.be.undefined; //TODO: Replace with better assertion (?)
                expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
                expect(mockGetSubmission).to.have.been.called.with(testSubmission2.getId());
                expect(mockGetSubmission).to.have.been.called.twice;

                //Pulls from cache
                return testSubmissionManager.compareSubmissions(testSubmission2.getId(),testSubmission.getId()).then((analysisResult) => {
                    expect(analysisResult).to.not.be.undefined; //TODO: Replace with better assertion (?)
                    expect(mockGetSubmission).to.have.been.called.twice;
                });
            });
        });

        it("Should return an appropriate error if {id_a} is valid and {id_b} does not exist",() => {

            var testSubmission2 = new Submission.builder().build();

            var mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
                return new Promise((resolve,reject) => {
                    if(submissionId === testSubmission2.getId()) {
                        reject(new Error("No submission exists with id"));
                    } else {
                        resolve(testSubmission);
                    }
                });
            });

            return testSubmissionManager.compareSubmissions(testSubmission.getId(),testSubmission2.getId()).then(res => {
                expect(true,"compareSubmission is succeeding where it should fail (one id does not exist)").to.be.false;
            }).catch((err) => {
                expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
                expect(mockGetSubmission).to.have.been.called.with(testSubmission2.getId());
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("No submission exists with id");
            });
        });
        
        it("Should return an appropriate error if {id_b} is valid and {id_a} does not exist",() => {

            var testSubmission2 = new Submission.builder().build(); 

            var mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
                return new Promise((resolve,reject) => {
                    if(submissionId === testSubmission.getId()) {
                    reject(new Error("No submission exists with id"));
                } else {
                    resolve(testSubmission2);
                }
                });
            });

            return testSubmissionManager.compareSubmissions(testSubmission2.getId(),testSubmission.getId()).then(res => {
                expect(true,"compareSubmission is succeeding where it should fail (one id does not exist)").to.be.false;
            }).catch((err) => {
                expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
                expect(mockGetSubmission).to.have.been.called.with(testSubmission2.getId());
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("No submission exists with id");
            });
        });

        it("Should return an appropriate error if getSubmissions fails",() => {

            var testSubmission2 = new Submission.builder().build(); 

            chai.spy.on(testSubmissionManager,'getSubmission',() => {return Promise.reject(new Error("getSubmission failed"))});

            return testSubmissionManager.compareSubmissions(testSubmission2.getId(),testSubmission.getId()).then(res => {
                expect(true,"compareSubmission is succeeding where it should fail (GET failed)").to.be.false;
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("getSubmission failed");
            });
        });
    });

    describe("getSubmissionFileContent()",() => {
        
       beforeEach(() => {
            testSubmissionManager = new SubmissionManager(); //NECESSARY TO CLEAR THE CACHE
        });

        it("Should obtain the content of the specified file if it exists",()=> {
            let testFileContent = 'HOT YOUTUBE CONTENT';
            
            let builder = new Submission.builder();
            builder.setFileContents(new Map<string, string>().set(testFileName, testFileContent));
            let mockSubmission = builder.build();

            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("",mockSubmission.getId(),testFileName,"1",2,3,4,5,"5","5"));
            var mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(mockSubmission)});
    
            return testSubmissionManager.getSubmissionFileContent(mockSubmission.getId(),testFileName).then((content) => {
                expect(content).to.deep.equal(testFileContent);
                expect(mockGetSubmission).to.have.been.called.once.with(mockSubmission.getId());
            });
        });

        it("Should throw an appropriate error if the specified submission does not exist",() => {
            
            var mockSubmission = new Submission.builder().build();
            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("",mockSubmission.getId(),testFileName,"1",2,3,4,5,"5","5"));

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.reject(new Error("Submission does not exist"))});
            
            return testSubmissionManager.getSubmissionFileContent(mockSubmission.getId(),testFileName).then((content) => {
                expect(true,"Expected getSubmissionFileContent to fail (no submission) but it succeeded").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Submission does not exist");
            });
        });

        it("Should throw an appropriate error if the specified file does not exist",() => {
            
            var mockSubmission = new Submission.builder().build();
            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("",mockSubmission.getId(),testFileName,"1",2,3,4,5,"5","5"));

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(mockSubmission)});
            return testSubmissionManager.getSubmissionFileContent(mockSubmission.getId(),testFileName).then((content) => {
                expect(true,"Expected getSubmissionFileContent to fail (no file) but it succeeded").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.contains("No such file");
            });
        });
    });
});