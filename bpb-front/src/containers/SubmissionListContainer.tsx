import React from 'react';
import { connect } from 'react-redux';

export const stateToPropertyMapper=(state) => {
    return {
        tempAssignment: state.SubmissionReducer.tempAssignment,
        submissionComparison: state.ComparisonReducer.state
    }
}

export const dispatchToPropertyMapper=(dispatch) => {
    return {
        dispatch: dispatch
    }
}