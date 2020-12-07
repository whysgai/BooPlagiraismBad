import Submission from "../types/Submission"

// the URL that is used for the server
const vagrantURL = 'http://192.168.33.10:8080/'
const envURL = process.env.REACT_APP_BPB_SRVADDR

export async function getComparison(compareSubmissions : Submission[]) : Promise<JSON[]> {
    let response = await fetch(`${envURL}submissions/compare/${compareSubmissions[0]._id}/${compareSubmissions[1]._id}`);
    let asJson = await response.json();
    //console.log("Comparisons from comparison service", asJson);
    return Promise.resolve(asJson);
}

export async function getFileContent(submissionId: String, fileIndex: number) : Promise<String> {
    let response = await fetch(`${envURL}submissions/${submissionId}/files/${fileIndex}`);
    let asJson = await response.json();
    console.log("File content from comparison service", asJson);
    return Promise.resolve(asJson.content);
} 

export default {getComparison, getFileContent }