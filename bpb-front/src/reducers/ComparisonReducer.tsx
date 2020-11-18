const ComparisonReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_COMPARE':
            if (state.length < 2) {
                state.push(action.submission)
            }
            else {
                // throw an error?
            }
            return state
        case 'REMOVE_COMPARE':
            if (state.length == 0) {
                return state
            }
            state = state.filter(subIndex => subIndex != action.submission)
            return state
        case 'COMPARE':
            return //TODO;
        default:
            return state;
    }
};

export default ComparisonReducer;