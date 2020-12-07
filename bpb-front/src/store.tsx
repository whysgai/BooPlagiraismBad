import { createStore, combineReducers, Store } from 'redux';
import ComparisonReducer from './reducers/ComparisonReducer';
import SubmissionReducer from './reducers/SubmissionReducer';
import AssignmentReducer from './reducers/AssignmentReducer';

/**
 * Bind the reducers to the store so that they are accessible from any component they're needed in.
 */
const reducers = combineReducers({
  ComparisonReducer: ComparisonReducer,
  SubmissionReducer: SubmissionReducer,
  AssignmentReducer: AssignmentReducer
})

export const store: Store = createStore(reducers);