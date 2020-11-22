import React, { Dispatch } from 'react';
// import { connect } from 'react-redux';
// import SubmissionListComponent from '../SubmissionListComponent'
// import { addSubmissionComparison, removeSubmissionComparison } from '../actions/ComparisonAction';
// import SubmissionReducer from '../reducers/SubmissionReducer'
// import ComparisonReducer from '../reducers/ComparisonReducer'
// import { Reducer, Store } from 'redux';
// import Submission from '../types/Submission';

// interface stateType {
//     SubmissionReducer: Reducer,
//     ComparisonReducer: Reducer
// }

// export const stateToPropertyMapper=(state: Store) => {
// export const stateToPropertyMapper=() => {
//     return {
//         tempAssignment: SubmissionReducer,
//         submissionComparison: ComparisonReducer
//     }
// }

// export const dispatchToPropertyMapper=(dispatch: Dispatch) => {
//     return {
//         addSubmissionComparison: (submission: Submission) => dispatch(addSubmissionComparison(submission)),
//         removeSubmissionComparison: (submission: Submission) => dispatch(removeSubmissionComparison(submission))
//     }
// }

// export default connect(
//     stateToPropertyMapper,
//     dispatchToPropertyMapper
// )(SubmissionListComponent)