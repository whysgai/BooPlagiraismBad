import Submission from '../types/Submission';

const initialState = {
    submissions: [],
    compareSubmissions: [],
    tempAssignment: {
        _id: '123',
        name: 'Temp Assignment',
        submissionIds: []
    }
}

const SubmissionReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'READ_SUBMISSIONS':
            
        case 'UPLOAD_SUBMISSION':

        case 'DELETE_SUBMISSION':

        default:
            return state;
    }
};

export default SubmissionReducer;