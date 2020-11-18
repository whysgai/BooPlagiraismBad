const ComparisonReducer = (state = [], action) => {
    switch (action.type) {
        case 'COMPARE':
            return ;
        default:
            return state;
    }
};

export default ComparisonReducer;