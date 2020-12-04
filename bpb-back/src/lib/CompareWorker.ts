import { parentPort, workerData } from 'worker_threads';

const array = workerData;

console.log(array);

let result = "fake!"

parentPort.postMessage(result);
process.exit();