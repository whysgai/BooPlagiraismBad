import React from 'react';
import { connect } from 'react-redux';
import SubmissionListComponent from '../SubmissionListComponent'
import { addSubmissionComparison, removeSubmissionComparison } from '../actions/ComparisonAction';
import SubmissionReducer from '../reducers/SubmissionReducer'
import ComparisonReducer from '../reducers/ComparisonReducer'

// interface stateType {
//     SubmissionReducer,
//     ComparisonReducer
// }

// export const stateToPropertyMapper=(state) => {
// export const stateToPropertyMapper=() => {
//     return {
//         tempAssignment: SubmissionReducer,
//         submissionComparison: ComparisonReducer
//     }
// }

// export const dispatchToPropertyMapper=(dispatch) => {
//     return {
//         addSubmissionComparison: (submission) => dispatch(addSubmissionComparison(submission)),
//         removeSubmissionComparison: (submission) => dispatch(removeSubmissionComparison(submission))
//     }
// }

// export default connect(
//     stateToPropertyMapper,
//     dispatchToPropertyMapper
// )(SubmissionListComponent)