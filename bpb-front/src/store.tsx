import { createStore, combineReducers, Store } from 'redux';
import ComparisonReducer from './reducers/ComparisonReducer';
import SubmissionReducer from './reducers/SubmissionReducer';
import AssignmentReducer from './reducers/AssignmentReducer';

//import "../node_modules/bootstrap/dist/css/bootstrap.min";
//require('bootstrap');

const reducers = combineReducers({
  ComparisonReducer: ComparisonReducer,
  SubmissionReducer: SubmissionReducer,
  AssignmentReducer: AssignmentReducer
})

export const store: Store = createStore(reducers);