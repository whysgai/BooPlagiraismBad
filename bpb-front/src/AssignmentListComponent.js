import React from 'react';
import './AssignmentListComponent.css';
import AssignmentListCard from './AssignmentListCard'
<<<<<<< HEAD
import {Link} from 'react-router-dom'

function AssignmentListComponent({assignments}) {
  return (
    <div className='assignment-list'>
      <Link to="#" className="new-assignment-btn">new</Link>
      <ul>
        {
          assignments.map((assignment,index) => 
              <li><AssignmentListCard assignment={assignment}/></li>
           )
=======

function AssignmentListComponent({assignments}) {
  return (
    <div className="App">
      <ul>
        {
          assignments.map((assignment,index) => {
              <li><AssignmentListCard assignment={assignment}/></li>
           })
>>>>>>> 4d94d08 (BPB-11 test: Add component body and fix tests)
        }
      </ul>
    </div>
  );
}

export default AssignmentListComponent
