import React from 'react';
import { connect } from 'react-redux';

const stateToPropertyMapper=(state) => {
    return {
        tempAssignment: state.SubmissionReducer.tempAssignment
    }
}

const dispatchToPropertyMapper=(dispatch) => {
    return {
        
    }
}