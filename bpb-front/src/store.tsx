import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ComparisonReducer from './reducers/ComparisonReducer';
import SubmissionReducer from './reducers/SubmissionReducer';

//import "../node_modules/bootstrap/dist/css/bootstrap.min";
//require('bootstrap');

const reducers = combineReducers({
  ComparisonReducer: ComparisonReducer,
  SubmissionReducer: SubmissionReducer
})

export const store = createStore(reducers);