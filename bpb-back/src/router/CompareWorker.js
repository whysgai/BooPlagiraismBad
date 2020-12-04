const { parentPort, workerData } = require('worker_threads');

const elements = workerData;
let submissionManager = elements[0];
let submissionIdA = elements[1];
let submissionIdB = elements[2];

submissionManager.compareSubmissions(submissionIdA, submissionIdB)
.then((analysisResults) => {
  let analysisResultsJson = analysisResults.map((result) => result.asJSON());
  parentPort.postMessage(analysisResultsJson);
  process.exit();
}).catch((err) => {
    parentPort.postMessage(err);
    process.exit();
});
