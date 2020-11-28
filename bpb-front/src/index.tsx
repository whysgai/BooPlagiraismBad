import React from 'react';
//import "font-awesome/css/font-awesome.min";
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter, Route } from 'react-router-dom';
import AssignmentListComponent from './AssignmentListComponent';
import ComparisonComponent from './ComparisonComponent';
import CreateAssignmentComponent from './CreateAssignmentComponent';
import CreateSubmissionComponent from './CreateSubmissionComponent';
import HelpComponent from './HelpComponent';
import SubmissionListComponent from './SubmissionListComponent';
import * as serviceWorker from './serviceWorker';
import NavbarComponent from './NavbarComponent';
import {store} from './store'
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

//import "../node_modules/bootstrap/dist/css/bootstrap.min";
//require('bootstrap');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <NavbarComponent />
      <Route exact path="/"><AssignmentListComponent assignments={
        [
          {_id:"5fc2bfcec7bce1079ac4eee7", name:"Mikayla", submissionIds:['1','2','3']},
          {_id:"02", name:"Ture", submissionIds:['2']}
        ]
      }/></Route>
      {/* <Route exact path="/"><AssignmentListComponent assignments={[]}/></Route> */}
      <Route path="/CreateAssignment" component={CreateAssignmentComponent}/>

      <Route exact path="/Submissions"><SubmissionListComponent submissions={
        [
          {_id:"01", name:"Mikayla", assignment:'Assignment1', files:[]},
          {_id:"02", name:"Will", assignment:'Assignment1', files:[]},
        ] 
      } compareEnabled={0}/></Route>
      {/* <Route path="/Assignment/:AssignmentID" component={SubmissionListComponent}/> */}
      <Route path="/CreateSubmission" component={CreateSubmissionComponent}/>
      <Route path="/Help" component={HelpComponent}/>
      <Route path="/CompareSubmissions" component={ComparisonComponent}/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
