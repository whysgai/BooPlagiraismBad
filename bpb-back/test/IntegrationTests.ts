import chai, { expect } from 'chai';
import App from "../src/App";
import { AppConfig } from "../src/AppConfig";
import chaiHttp from 'chai-http';
import { ExpressionContext } from 'java-ast';
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

    it('should correctly create a submission (end-to-end)',() => {
        return chai.request(baseURI).post("/Assignments").send({"name":"Test Assignment","submissionIds":[]}).then((createdAssignmentRes) => {
            expect(createdAssignmentRes.status).to.equal(200);
            let assignmentId = createdAssignmentRes.body._id;

            return chai.request(baseURI).post("/Submissions").send({"name":"Test Submission","assignment_id":assignmentId}).then((createdSubmissionRes) => {
                expect(createdSubmissionRes.status).to.equal(200);
                let submissionId = createdSubmissionRes.body._id;
            });
        });
    });
});