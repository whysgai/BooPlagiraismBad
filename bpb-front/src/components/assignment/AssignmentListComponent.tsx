import React from 'react';
import AssignmentListCard from './AssignmentListCard'
import Assignment from '../../types/Assignment'
import {Link} from 'react-router-dom'
import {store} from '../../store'
import { readAssignments } from '../../actions/AssignmentAction';

/**
 * Constructor type interface to set the types of any properties in the constructor of the component.
 */
interface ConstructorType {
  assignments: Assignment[]
}

/**
 * Props type interface to set the types of any props that are passed from a parent component.
 */
interface PropsType {}

/**
 * Assignment list component renders a list of assignment components for the user or displays to the user that there are no
 * assignments that are in the server.
 */
class AssignmentListComponent extends React.Component <PropsType, ConstructorType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      assignments : store.getState().AssignmentReducer.assignments
    };
  }
  
  /**
   * Component did mount re-renders the page after an initial render. This reads all assignments from the server
   * and then displays them to the user.
   */
  componentDidMount() {
    readAssignments()
      .then((assignmentAction) => store.dispatch(assignmentAction))
      .then(() => {
        this.setState({
          assignments : store.getState().AssignmentReducer.assignments
        })
      })
  }

  /**
   * Maps through the list of assignments that was produced by the server and displays each of them for the user,
   * or if there are none it will display that none exist.
   */
  render () {
    return (    
      <div className="container card">
        <div className="card-body">    
          <div className='assignment-list col-12'>
            <div className="row">
              <h3 className="col-6 text-center">Assignments</h3>
              <Link to="/CreateAssignment" className="btn btn-outline-info btn-new-assignment col-6 mt-2 mb-2">Create New Assignment</Link>
            </div>            
              {
                this.state.assignments.length > 0 &&
                  <div className=''>
                    {
                      this.state.assignments.map((assignment,index) => 
                          <div className='card col-12 mb-2' key={index}><AssignmentListCard assignment={assignment} createAssignment={(arg: String) => null}/></div>
                      )
                    }
                  </div>
              }
              {
                this.state.assignments.length <= 0 &&
                  <h5>No assignments to display</h5>
              }        
          </div>
        </div>  
      </div>  
    );
  }
}

export default AssignmentListComponent
