import Submission from "../types/Submission"

const URL = 'http://192.168.33.10:8080/'

export function getComparison(compareSubmissions : Submission[]) : void {
    fetch(`${URL}submissions/compare/${compareSubmissions[0]._id}/${compareSubmissions[1]._id}`)
}

export async function getFileContent(submissionId: String, fileIndex: number) : Promise<String> {
    let response = await fetch(`${URL}submissions/${submissionId}/files/${fileIndex}`);
    let asJson = await response.json();
    console.log("From comparison service", asJson);
    return Promise.resolve(asJson.content);
} 

export default {getComparison, getFileContent }