import Submission from '../types/Submission';
import Action from "../types/Action"

const initialState = {
    submissions: [] as Submission[],
    compareSubmissions: [] as Submission[],
    tempAssignment: {
        _id: '123',
        name: 'Temp Assignment',
        submissionIds: [] as Submission[]
    },
    newSubmission: {} as Submission,
}

const SubmissionReducer = (state = initialState, action : Action) => {
    switch (action.type) {

        case 'READ_SUBMISSIONS':
            return {
                ...state,
                submissions: action.submissions
            }  
            
        case 'UPLOAD_SUBMISSION':
            return {
                ...state,
            }

        case 'DELETE_SUBMISSION':
            let submission : Submission
            let newSubmissions : Submission[] = []
            for (submission of state.submissions) {
                if (submission != action.removeSubmission) {
                    newSubmissions.push(submission)
                }
            }
            return {
                ...state,
                submissions: newSubmissions
            }
        default:
            return state;
    }
};

export default SubmissionReducer;