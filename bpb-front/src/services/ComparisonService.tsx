import Submission from "../types/Submission"

const URL = 'http://192.168.33.10:8080/'

export async function getComparison(compareSubmissions : Submission[]) : Promise<JSON[]> {
    let response = await fetch(`${URL}submissions/compare/${compareSubmissions[0]._id}/${compareSubmissions[1]._id}`);
    let asJson = await response.json();
    console.log("Comparisons from comparison service", asJson);
    return Promise.resolve(asJson);
}

export async function getFileContent(submissionId: String, fileIndex: number) : Promise<String> {
    let response = await fetch(`${URL}submissions/${submissionId}/files/${fileIndex}`);
    let asJson = await response.json();
    console.log("File content from comparison service", asJson);
    return Promise.resolve(asJson.content);
} 

export default {getComparison, getFileContent }