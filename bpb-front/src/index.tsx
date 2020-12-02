import React from 'react';
//import "font-awesome/css/font-awesome.min";
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter, Route } from 'react-router-dom';
import AssignmentListComponent from './components/assignment/AssignmentListComponent';
import ComparisonComponent from './components/comparison/ComparisonComponent';
import CreateAssignmentComponent from './components/assignment/CreateAssignmentComponent';
import CreateSubmissionComponent from './components/submission/CreateSubmissionComponent';
import HelpComponent from './components/HelpComponent';
import SubmissionListComponent from './components/submission/SubmissionListComponent';
import * as serviceWorker from './serviceWorker';
import NavbarComponent from './components/NavbarComponent';
import {store} from './store'
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

//import "../node_modules/bootstrap/dist/css/bootstrap.min";
//require('bootstrap');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <NavbarComponent />
      <Route exact path="/"><AssignmentListComponent /></Route>
      <Route path="/CreateAssignment" component={CreateAssignmentComponent}/>
      <Route exact path="/Assignments/:assignmentId/Submissions" component={SubmissionListComponent}/>
      <Route path="/Assignments/:assignmentId/CreateSubmission" component={CreateSubmissionComponent}/>
      <Route path="/Help" component={HelpComponent}/>
      <Route path="/Assignments/:assignmentId/CompareSubmissions" component={ComparisonComponent}/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
