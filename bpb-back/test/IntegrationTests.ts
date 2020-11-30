import chai, { expect } from 'chai';
import App from "../src/App";
import { AppConfig } from "../src/AppConfig";
import chaiHttp from 'chai-http';
import fs from 'fs';
import util from 'util';
const readFileContent = util.promisify(fs.readFile);

/**
 * App Integration Tests
 */
describe("App (Integration)",() =>  {

    let app  : App;
    let baseURI : string;

    before((done) => {
        
        baseURI = "http://127.0.0.1:" + AppConfig.port();
        chai.use(chaiHttp);

        app = new App(AppConfig.dbConnectionString(),AppConfig.port());
        app.run().then(() => {
            done();
        });
    });
    after((done) => {
        app.shutDown();
        done();
    });

    it('should correctly create a submission (end-to-end)',async () => {

        let fileContentA = await readFileContent("test/res/javaExample.java");
        let fileContentB = await readFileContent("test/res/javaExample2.java");
        let fileContentC = await readFileContent("test/res/javaExample3.java");
        let fileContentD = await readFileContent("test/res/javaExample4.java");

        return chai.request(baseURI).post("/Assignments").send({"name":"Test Assignment","submissionIds":[]}).then((createdAssignmentRes) => {
            expect(createdAssignmentRes.status).to.equal(200);
            let assignmentId = createdAssignmentRes.body._id;

            return chai.request(baseURI).post("/Submissions").send({"name":"Test Submission A","assignment_id":assignmentId}).then((createdSubmissionARes) => {
                expect(createdSubmissionARes.status).to.equal(200);
                let submissionIdA = createdSubmissionARes.body._id;

                return chai.request(baseURI).post("/Submissions").send({"name":"Test Submission B","assignment_id":assignmentId}).then((createdSubmissionBRes) => {
                    expect(createdSubmissionBRes.status).to.equal(200);
                    let submissionIdB = createdSubmissionBRes.body._id;

                    return chai.request(baseURI).post("/Submissions/" + submissionIdA + "/files")
                    .attach("submissionFile",fileContentA,"javaExampleA.java").then((fileContentARes) => {
                        expect(fileContentARes.status).to.equal(200);
                        
                        return chai.request(baseURI).post("/Submissions/" + submissionIdB + "/files")
                        .attach("submissionFile",fileContentB,"javaExampleB.java").then((fileContentBRes) => {
                            expect(fileContentBRes.status).to.equal(200);
                            
                            return chai.request(baseURI).post("/Submissions/" + submissionIdA + "/files")
                            .attach("submissionFile",fileContentC,"javaExampleC.java").then((fileContentCRes) => {
                                expect(fileContentCRes.status).to.equal(200);

                                return chai.request(baseURI).post("/Submissions/" + submissionIdB + "/files")
                                .attach("submissionFile",fileContentD,"javaExampleD.java").then((fileContentDRes) => {
                                    expect(fileContentDRes.status).to.equal(200);
                                    
                                    return chai.request(baseURI).get("/Submissions/compare/" + submissionIdA + "/" + submissionIdB).then((comparisonRes) => {
                                        expect(comparisonRes.status).to.equal(200);
                                        console.log(comparisonRes.body);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});