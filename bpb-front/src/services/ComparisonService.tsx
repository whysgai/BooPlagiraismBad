import Submission from "../types/Submission"

const URL = 'http://192.168.33.10:8080/'

export function getComparison(compareSubmissions : Submission[]) : void {
    fetch(`${URL}submissions/compare/${compareSubmissions[0]._id}/${compareSubmissions[1]._id}`)
}

export default {getComparison}