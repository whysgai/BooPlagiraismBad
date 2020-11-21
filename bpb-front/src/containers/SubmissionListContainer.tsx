import React from 'react';
import { connect } from 'react-redux';
import SubmissionListComponent from '../SubmissionListComponent'
import { addSubmissionComparison } from '../actions/ComparisonAction';
import SubmissionReducer from '../reducers/SubmissionReducer'
import ComparisonReducer from '../reducers/ComparisonReducer'

export const stateToPropertyMapper=(state) => {
    return {
        tempAssignment: SubmissionReducer,
        submissionComparison: ComparisonReducer
    }
}

export const dispatchToPropertyMapper=(dispatch) => {
    return {
        addSubmissionComparison: (submission) => dispatch(addSubmissionComparison(submission)),
    }
}

// export default connect(
//     stateToPropertyMapper,
//     dispatchToPropertyMapper
// )(SubmissionListComponent)