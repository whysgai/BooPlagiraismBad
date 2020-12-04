import { parentPort, workerData } from 'worker_threads';
import { Submission } from '../model/Submission';
const input = workerData;

let submissionA = new Submission.builder().buildFromJson(input[0]);
let submissionB = new Submission.builder().buildFromJson(input[1]);

submissionA.compare(submissionB).then((analysisResults) => {

    var results = [] as any[];

    analysisResults.forEach(res => {
        results.push(res.asJSON());
    })

    parentPort.postMessage(results);
    process.exit();
}).catch((err) => {
    parentPort.postMessage(err);
    process.exit();
});