import { expect } from "chai";
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
import { ExplicitGenericInvocationContext } from "java-ast";

describe("SubmissionManager.ts",() => {

    let testSubmissionManager : ISubmissionManager;
    let testSubmission : ISubmission;
    let testSubmissionId : string;
    let testSubmissionName : string;
    let testSubmissionAssignmentId : string;
    let testFileName : string;
    let testFilePath : string;

    before(()=>{
        chai.use(chaiSpies);
        chai.use(chaiAsPromised);
        testSubmissionName = "testname";
        testSubmissionAssignmentId = "test_aid";
        testFileName = "javaExample.java";
        testFilePath = "/vagrant/bpb-back/test/res/javaExample.java"; 
        testSubmissionManager = SubmissionManager.getInstance();
    });

    beforeEach((done)=>{
        chai.spy.restore();

        let testSubmissionBuilder = new Submission.builder();
        testSubmissionBuilder.setName(testSubmissionName);
        testSubmissionBuilder.setAssignmentId(testSubmissionAssignmentId);
        testSubmission = testSubmissionBuilder.build();
        testSubmissionId = testSubmission.getId()

        done();
    });

    describe("ComparisonCache", () => {
        let testComparisonCache : ComparisonCache;
        let submissionIdA : string;
        let submissionIdB : string;
        let analysisResults : string;
        let analysisResultEntries : IAnalysisResultEntry[][];
        
        before(() => {
            submissionIdA = 'abcd';
            submissionIdB = 'efgh';
            let entryA = new AnalysisResultEntry('1', submissionIdA, '3', '4', 5, 6, 7, 8, '9', '10');
            let entryB = new AnalysisResultEntry('11', submissionIdB, '13', '14', 15, 16, 17, 18, '19', '20');
            analysisResultEntries = new Array<IAnalysisResultEntry[]>();
            analysisResultEntries.push([entryA, entryB]);
            analysisResults = [new AnalysisResult(analysisResultEntries, 3, submissionIdA, submissionIdB, 'fileA', 'fileB').asJSON()].toString();
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
            let newAnalysisResults = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile').asJSON()].toString();
            testComparisonCache.set(submissionIdA, submissionIdB, analysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(analysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(analysisResults);
            
            testComparisonCache.set(submissionIdA, submissionIdB, newAnalysisResults);
            expect(testComparisonCache.get(submissionIdA, submissionIdB)).to.be.equal(newAnalysisResults);
            expect(testComparisonCache.get(submissionIdB, submissionIdA)).to.be.equal(newAnalysisResults);
        });

        it("Calling set() again with parameters flipped should replace the initial set.", () => {
            let newAnalysisResults = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile').asJSON()].toString();
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
            let newAnalysisResultsA = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile').asJSON()].toString();
            let newAnalysisResultsB = [new AnalysisResult(analysisResultEntries, 4, submissionIdA, submissionIdB, 'someFile', 'someOtherFile').asJSON()].toString();
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
    
    describe("invalidateCaches()",() => {
        
        //Note: Doesn't directly test clear for ComparisonCache
        it("Should clear the cache and reset cache count",() => {
            let mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.resolve(testSubmission)});

            //Initial query accesses DAO and returns mock
            return testSubmissionManager.getSubmission(testSubmissionId).then((submission) => {
                expect(submission).to.deep.equal(testSubmission);
                expect(mockReadSubmission).to.have.been.called.once.with(testSubmissionId);

                //Second query uses cache (doesn't access DAO)
                return testSubmissionManager.getSubmission(testSubmissionId).then((submission2) => {
                    expect(submission2).to.deep.equal(testSubmission);
                    expect(mockReadSubmission).to.have.been.called.once; // Cache is used
                    
                    testSubmissionManager.invalidateCaches();

                    return testSubmissionManager.getSubmission(testSubmissionId).then((submission2) => {
                        expect(submission2).to.deep.equal(testSubmission);
                        expect(mockReadSubmission).to.have.been.called.twice; // Cache is NOT used (was invalidated)
                    });
                });
            });
        });
    });

    describe("getInstance",() => {
        it("should always return the same SubmissionManager instance",() => {
            let smA = SubmissionManager.getInstance();
            let smB = SubmissionManager.getInstance();
            expect(smA).to.equal(smB);
        });
    });

    describe("getSubmission()",() => {

        beforeEach(() => {
            testSubmissionManager.invalidateCaches();
        });
        
        it("Should return submission if the provided ID is valid",()=> {
            let mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.resolve(testSubmission)});

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
            
            let mockReadSubmission = chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.reject(new Error("No submission exists with id"))});
            
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
            testSubmissionManager.invalidateCaches();
        });
        
        it("Should return submissions of the given assignment if there are some",()=> {
            let mockReadSubmissions = chai.spy.on(SubmissionDAO,'readSubmissions',() =>{return Promise.resolve([testSubmission])});
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
            testSubmissionManager.invalidateCaches();
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
            testSubmissionManager.invalidateCaches(); 
        });
        
        it("Should properly create a submission if body parameters are correct (includes name, assignment_id)",() => {
            
            chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
            let createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}

            return testSubmissionManager.createSubmission(createBody).then((submission) => {
                expect(submission.getName()).to.equal(testSubmission.getName());
                expect(submission.getAssignmentId()).to.equal(testSubmission.getAssignmentId());
            });
        });

        describe(" createSubmission/getSubmission Cache tests", () => {

            beforeEach(() => {
                testSubmissionManager.invalidateCaches(); 
            })

            it("Should properly cache the submission in submissionCache",() => {
                chai.spy.on(SubmissionDAO,'createSubmission',() => {return Promise.resolve(testSubmission)});
                let mockReadSubmission = chai.spy.on(SubmissionDAO, 'readSubmission', () => {return Promise.resolve(testSubmission)});
                let createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
    
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
                let createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
    
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
                let createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
                
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
                let createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId}
                let createBody2 : SubmissionData = {name:testSubmission.getName(),assignment_id:'a different assignment Id'}
                
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

            let createBody : SubmissionData = {name:testSubmission.getName(),assignment_id:testSubmissionAssignmentId};
            
            return testSubmissionManager.createSubmission(createBody).then(() => {
                expect(true,"createSubmission should fail, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Failed to create");
            })
        });
    });

    describe("updateSubmission()",() => {

        beforeEach(() => {
            testSubmissionManager.invalidateCaches(); 
        });
        
        it("Should properly update a submission if body parameters are included and submission exists with id",() => {
                        
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',(submission) => {return Promise.resolve(submission)}); //Pass through

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";

            let updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(submission.getName()).to.equal(expectedNewName);
                expect(submission.getAssignmentId()).to.equal(expectedNewAssnId);
                expect(submission.getId()).to.equal(testSubmission.getId());
            });
        });

        it("Should properly update a submission if submission exists and only one new body parameter is provided (name)",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',(submission) => {return Promise.resolve(submission)}); //Pass through

            let expectedNewName = "test";

            let updateBody : SubmissionData = {name:expectedNewName, assignment_id: testSubmission.getAssignmentId()};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(submission.getName()).to.equal(expectedNewName);
                expect(submission.getAssignmentId()).to.equal(testSubmissionAssignmentId);
                expect(submission.getId()).to.equal(testSubmission.getId());
            });
        });

        it("Should properly update a submission if submission exists and only one new body parameter is provided (assignment_id)",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.resolve(testSubmission)});
            chai.spy.on(SubmissionDAO,'updateSubmission',(submission) => {return Promise.resolve(submission)}); //Pass-through updated submission

            let expectedNewAssnId = "test2";

            let updateBody : SubmissionData = {name: testSubmission.getName(), assignment_id:expectedNewAssnId};

            return testSubmissionManager.updateSubmission(testSubmission.getId(),updateBody).then((submission) => {
                expect(submission.getName()).to.equal(testSubmissionName);
                expect(submission.getAssignmentId()).to.equal(expectedNewAssnId);
                expect(submission.getId()).to.equal(testSubmission.getId());
            });
        });
        
        it("Should return an appropriate error if submission doesn't exist with the provided id",() => {
            chai.spy.on(SubmissionDAO,'readSubmission',() => {return Promise.reject(new Error("Submission does not exist"))});
            chai.spy.on(SubmissionDAO,'updateSubmission');

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";

            let updateBody : SubmissionData = {name:expectedNewName,assignment_id:expectedNewAssnId};

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

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";

            let updateBody : SubmissionData = {name:expectedNewName,assignment_id:expectedNewAssnId};

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

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";

            let updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};

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

            let expectedNewName = "test";
            let expectedNewAssnId = testSubmissionAssignmentId;
            let updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};
            
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

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";
            let updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};

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

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";
            let updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};
            
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

            let expectedNewName = "test";
            let expectedNewAssnId = "test2";
            let updateBody = {name:expectedNewName,assignment_id:expectedNewAssnId};
            
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
            testSubmissionManager.invalidateCaches(); 
        });

        it("Should save and add a file into the submission specified by the client",() => {

            let mockSubmission = new Submission.builder().build();

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(mockSubmission)});
            let mockUpdateSubmission = chai.spy.on(SubmissionDAO,'updateSubmission',() =>{return Promise.resolve(mockSubmission)}); //Required

            let mockAddFile = chai.spy.on(mockSubmission,'addFile',() => { return Promise.resolve() });
            let expectedContent = 'HOT CONTENT';
            
            testSubmissionManager.processSubmissionFile(mockSubmission.getId(),testFileName, expectedContent).then(() => {
                expect(mockAddFile).to.have.been.called.with(expectedContent,testFileName);
                expect(mockUpdateSubmission).to.have.been.called.with(mockSubmission);
            });
        });

        it("Should return an appropriate error if file was already added to the submission",() => {
            
            let mockSubmission = new Submission.builder().build();
            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1","tset",testFileName,"test",1,1,2,2,"test","Test"));

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(testSubmission)});
            let mockUpdate = chai.spy.on(SubmissionDAO,'updateSubmission',() =>{ return Promise.resolve(testSubmission)}); //Required
            
            chai.spy.on(testSubmission,'addFile',() => {return Promise.reject(new Error("Submission file " + testFileName + " was already added to the submission"))});
            let expectedContent = 'HOT CONTENT';
        
            return testSubmissionManager.processSubmissionFile(mockSubmission.getId(),testFileName, expectedContent).then(() => {
                expect(true,"processSubmissionFile is succeeding where it should fail (file name was already added)").to.equal(false);
            }).catch((err) => {
                expect(err).to.not.be.undefined;
                expect(err).to.have.property("message").which.equals("Submission file " + testFileName + " was already added to the submission");
                expect(mockUpdate).to.not.have.been.called;
            });
        });

        it("Should return an appropriate error if submission ID is invalid",() => {
            
            let mockSubmission = new Submission.builder().build();
            
            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.reject(new Error("Submission does not exist"))});
            let mockUpdate = chai.spy.on(SubmissionDAO,'updateSubmission',() =>{return Promise.resolve(testSubmission)}); //Required
            let mockAddFile = chai.spy.on(testSubmission,'addFile');
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

            let mockSubmission = new Submission.builder().build();
            
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
            
            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1",testSubmission.getId(),'fileName',"test",1,2,1,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e"));
           
            //Create an updated model for comparison
            let updatedModel = testSubmission.getModelInstance()
            let updatedFileContents = [newContent];
            updatedModel.fileContents = updatedFileContents;
            updatedModel._id = testSubmissionId;
            updatedModel.entries = [['fileName', [new AnalysisResultEntry("are1",testSubmission.getId(),'fileName',"test",1,2,1,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e")]]];
            
            let updatedTestSubmission = new Submission.builder().buildFromExisting(updatedModel);
            let testSubmission2 = new Submission.builder().build(); 
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are2",testSubmission2.getId(),'anotherFileName',"test2",1,1,2,2,"890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","e"));
            testSubmission2.addFile('anotherFileName', newContent); 
            
            let mockReadSubmissions = chai.spy.on(SubmissionDAO, 'readSubmissions', () => {return Promise.resolve([testSubmission])});
            let mockUpdateSubmissions = chai.spy.on(SubmissionDAO, 'updateSubmission', () => {return Promise.resolve(updatedTestSubmission)});
            let mockGetSubmission = chai.spy.on(testSubmissionManager, 'getSubmission',() => {return Promise.resolve(testSubmission)});

            let cache = new ComparisonCache();
            testSubmissionManager.setComparisonCache(cache);
            let cacheGet = chai.spy.on(cache,'get',()=>{return "some string"});

            return testSubmissionManager.compareSubmissions(testSubmission.getId(), testSubmission2.getId()).then((analysisResults) => {

                return testSubmissionManager.compareSubmissions(testSubmission.getId(), testSubmission2.getId()).then((analysisResults) => {
                    
                    return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((submissionArray) => { //should cache testSubmission
                        expect(cacheGet).to.not.have.been.called;
                        expect(submissionArray.length).to.be.equal(1);
                        expect(submissionArray[0].getName()).to.equal(testSubmissionName);

                        return testSubmissionManager.processSubmissionFile(testSubmissionId, testFileName, newContent).then(() => {
                            expect(testSubmission.getFileContents()).to.deep.equal(updatedFileContents);

                            return testSubmissionManager.getSubmission(testSubmissionId).then((modifiedSubmission) => {
                                expect(modifiedSubmission.getFileContents()).to.deep.equal(updatedFileContents);
                                expect(modifiedSubmission.getFileContents()[0]).to.deep.equal(newContent);
                                
                                return testSubmissionManager.getSubmissions(testSubmissionAssignmentId).then((modifiedSubArray) => {
                                    expect(modifiedSubArray[0].getFileContents()).to.deep.equal(updatedFileContents);
                                    expect(modifiedSubArray[0].getFileContents()[0]).to.deep.equal(newContent);
                                    
                                    return testSubmissionManager.compareSubmissions(testSubmission.getId(), testSubmission2.getId()).then((analysisResults) => { 
                                        expect(cacheGet).to.have.been.called;
                                        expect(analysisResults).to.equal("some string"); //Cache is used
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
            testSubmissionManager.invalidateCaches(); 
        });

        it("Should properly instruct SubmissionDAO to delete a submission if the specified {id} is valid",() =>{
            
            chai.spy.on(SubmissionDAO,'readSubmission',() =>{return Promise.resolve(testSubmission)});

            let mockDeleteSubmission = chai.spy.on(SubmissionDAO,'deleteSubmission',() => {return Promise.resolve(testSubmission)}); 
            
            return testSubmissionManager.deleteSubmission(testSubmissionId).then(() => {
                expect(mockDeleteSubmission).to.have.been.called.with(testSubmissionId);
            });
        });

        it("Should throw an error if there is no submission with the provided ID",() =>{
            
            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.reject(new Error("No submission exists with id"))});
            let mockDeleteSubmission = chai.spy.on(SubmissionDAO,'deleteSubmission',() => {}); 
            
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
            let mockDeleteSubmission = chai.spy.on(SubmissionDAO,'deleteSubmission',() => {return Promise.reject(new Error("Delete failed"))}); 
            
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
            testSubmissionManager.invalidateCaches(); 
        });

        it("Should return a valid AnalysisResult if both submissions are valid",() => {
            
            let testSubmission2 = new Submission.builder().build(); 

            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1",testSubmission.getId(),"test1","test1",1,2,1,2,"977365D9D3264C4874F181D4B5BF388F7E6CBA8D69BD2965DBF9C00010A8EF2D4A6C94","e"));
            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are2",testSubmission.getId(),"test2","test2",1,2,1,2,"4FA0029B4085EC515EE16451073904145553E520460994D545522AB121555C5E6A450C","e"));
            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are3",testSubmission.getId(),"test3","test3",1,2,1,2,"31F0F22AC52741875BE37CCC39BCB11281F6375862425EA9C7C052A226F9CB18DB516A","e"));
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are4",testSubmission2.getId(),"test4","test4",1,1,2,2,"656354D9D3265C4874F182D4B57F388F7E6CBA8D69BD2965CBF9C00010A8EF2D4A6C94","e"));
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are5",testSubmission2.getId(),"test5","test5",1,1,2,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e"));
            
            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
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
        }).timeout(8000);

        it("Should return a valid AnalysisResult if both submissions are valid (2, sorter coverage)",() => {
            
            let testSubmission2 = new Submission.builder().build(); 

            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1",testSubmission.getId(),"test1","test1",1,2,1,2,"977365D9D3264C4874F181D4B5BF388F7E6CBA8D69BD2965DBF9C00010A8EF2D4A6C94","e"));
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are2",testSubmission2.getId(),"test2","test2",1,2,1,2,"4FA0029B4085EC515EE16451073904145553E520460994D545522AB121555C5E6A450C","e"));
            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are3",testSubmission.getId(),"test3","test3",1,2,1,2,"31F0F22AC52741875BE37CCC39BCB11281F6375862425EA9C7C052A226F9CB18DB516A","e"));
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are4",testSubmission2.getId(),"test4","test4",1,1,2,2,"656354D9D3265C4874F182D4B57F388F7E6CBA8D69BD2965CBF9C00010A8EF2D4A6C94","e"));
            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are5",testSubmission.getId(),"test5","test5",1,1,2,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e"));
            
            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
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
            });
        }).timeout(8000);

        it("Should return an appropriate error message if comparison is in progress already",() => {
            
            let testSubmission2 = new Submission.builder().build(); 

            testSubmission.addAnalysisResultEntry(new AnalysisResultEntry("are1",testSubmission.getId(),"test1","test1",1,2,1,2,"890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd890abcd","e"));
            testSubmission2.addAnalysisResultEntry(new AnalysisResultEntry("are2",testSubmission2.getId(),"test4","test4",1,1,2,2,"1234567123456712345671234567123456712345671234567123456712345671234567","e"));
            
            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
                return new Promise((resolve,reject) => {
                    setTimeout(()=>{

                        if(submissionId === testSubmission.getId()) {
                            resolve(testSubmission);
                        } else {
                            resolve(testSubmission2);
                        }
                    },1000);
                });
            });

            //Do a bad thing
            testSubmissionManager.compareSubmissions(testSubmission2.getId(),testSubmission.getId()).catch((err) => {  });
            
            return testSubmissionManager.compareSubmissions(testSubmission2.getId(),testSubmission.getId()).then((res) => {
                expect(true,"to have failed, but it didn't").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Comparison between " + testSubmission2.getId() + " and " + testSubmission.getId() +" is already in progress, please wait!");
            });
        }).timeout(8000);

        it("Should return an appropriate error if submission compare fails",() => {

            testSubmissionManager.invalidateCaches(); 
            testSubmissionManager.setCompareWorker("./test/res/TestCompareWorker.js");

            let testSubmission2 = new Submission.builder().build();
             
            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',() =>{ return Promise.resolve(testSubmission2)});

            return testSubmissionManager.compareSubmissions(testSubmission.getId(),testSubmission2.getId()).then(res => {
                expect(true,"compareSubmission is succeeding where it should fail (submission.compare failed)").to.be.false;
            }).catch((err) => {
                expect(mockGetSubmission).to.have.been.called.with(testSubmission.getId());
                expect(mockGetSubmission).to.have.been.called.with(testSubmission2.getId());
                expect(err).to.have.property("message").which.equals("Some error!");
            });
        }).timeout(8000);

        it("Should return an appropriate error if {id_a} is valid and {id_b} does not exist",() => {

            let testSubmission2 = new Submission.builder().build();

            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
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
        }).timeout(8000);
        
        it("Should return an appropriate error if {id_b} is valid and {id_a} does not exist",() => {

            let testSubmission2 = new Submission.builder().build(); 

            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',(submissionId) =>{
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

            let testSubmission2 = new Submission.builder().build(); 

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
           testSubmissionManager.invalidateCaches();
        });

        it("Should obtain the content of the specified file if it exists",()=> {
            
            let builder = new Submission.builder();

            let testContent = "HOT YOUTUBE CONTENT"
            let files = ["somefile.java"];
            let fileContents = [testContent];

            builder.setFiles(files);
            builder.setFileContents(fileContents);
            let mockSubmission = builder.build();

            expect(mockSubmission.getFiles()).to.deep.equal(files);
            expect(mockSubmission.getFileContents()).to.deep.equal(fileContents)

            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("",mockSubmission.getId(),testFileName,"1",2,3,4,5,"5","5"));
            let mockGetSubmission = chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(mockSubmission)});
    
            return testSubmissionManager.getSubmissionFileContent(mockSubmission.getId(),0).then((content) => {
                expect(content).to.deep.equal(testContent);
                expect(mockGetSubmission).to.have.been.called.once.with(mockSubmission.getId());
            });
        });

        it("Should throw an appropriate error if the specified submission does not exist",() => {
            
            let mockSubmission = new Submission.builder().build();
            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("",mockSubmission.getId(),testFileName,"1",2,3,4,5,"5","5"));

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.reject(new Error("Submission does not exist"))});
            
            return testSubmissionManager.getSubmissionFileContent(mockSubmission.getId(),0).then((content) => {
                expect(true,"Expected getSubmissionFileContent to fail (no submission) but it succeeded").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.equals("Submission does not exist");
            });
        });

        it("Should throw an appropriate error if the specified file does not exist",() => {
            
            let mockSubmission = new Submission.builder().build();
            mockSubmission.addAnalysisResultEntry(new AnalysisResultEntry("",mockSubmission.getId(),testFileName,"1",2,3,4,5,"5","5"));

            chai.spy.on(testSubmissionManager,'getSubmission',() =>{return Promise.resolve(mockSubmission)});
            return testSubmissionManager.getSubmissionFileContent(mockSubmission.getId(),0).then((content) => {
                expect(true,"Expected getSubmissionFileContent to fail (no file) but it succeeded").to.equal(false);
            }).catch((err) => {
                expect(err).to.have.property("message").which.contains("No such file");
            });
        });
    });
});