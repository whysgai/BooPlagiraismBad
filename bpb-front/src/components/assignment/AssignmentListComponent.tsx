import React from 'react';
import AssignmentListCard from './AssignmentListCard'
import Assignment from '../../types/Assignment'
import {Link} from 'react-router-dom'
import {store} from '../../store'
import { readAssignments } from '../../actions/AssignmentAction';

interface PropsType {
  //assignments:Assignment[]
}

class AssignmentListComponent extends React.Component <PropsType, {assignments: Assignment[]}> {
  //({assignments = [{_id:"01", name:"Mikayla", submissionIds:[]}]}: {assignments: Assignment[]})
  constructor(props: PropsType) {
    super(props);
    this.state = {
      assignments : store.getState().AssignmentReducer.assignments
    };
  }
  
  componentDidMount() {
    console.log("Call readAssignments from mount");
    // store.dispatch(readAssignments().then(() =>)).then(() => {
    //   this.setState({
    //     assignments : store.getState().AssignmentReducer.assignments
    //   });
    // });    

    store.dispatch(readAssignments())
    this.setState({
      assignments : store.getState().AssignmentReducer.assignments
    })
  }


  render () {
    return (        
      <div className='assignment-list pl-2'>
        <Link to="/CreateAssignment" className="new-assignment-btn btn btn-outline-info ml-2">Create New Assignment</Link> 
          {
            console.log("Assignments in component", this.state.assignments)
          }       
          {
            this.state.assignments.length > 0 &&
              <ul className='nav'>
                {
                  this.state.assignments.map((assignment,index) => 
                      <li className='nav-item' key={index}><AssignmentListCard assignment={assignment} createAssignment={(arg: String) => null}/></li>
                  )
                }
              </ul>
          }
          {
            this.state.assignments.length <= 0 &&
              <h4>No assignments to display</h4>
          }        
      </div>
    );
  }
}

export default AssignmentListComponent
