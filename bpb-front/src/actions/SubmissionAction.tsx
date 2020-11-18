import Submission from '../types/Submission'

export default function compareSubmissions(compareSubmissions : Submission[]) {
    return {
        type: 'COMPARE',
        compareSubmissions: compareSubmissions,
    }
};