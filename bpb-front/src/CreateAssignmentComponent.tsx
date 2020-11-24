import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from './store';

interface PropsType {
  name: string
}

class CreateAssignmentComponent extends React.Component <PropsType, {}> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: this.props.name
        };
        this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event : ChangeEvent<HTMLInputElement>) {
    this.setState({
        [event.target.name]: event.target.value,
    });
  }

  callDispatch() {
    
  }

  render() {
    return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <div style={{textAlign: 'right', paddingRight: '50px', fontWeight: 'bolder'}}>
                <Link to="/">
                  x 
                </Link>
            </div>
            <h3>Create Assignment</h3>
            <br/>
            <span text-align="center">
                <h5>Assignment Name:</h5>
                <input
                    name="name"
                    type="text"
                    value={this.props.name}
                    onChange={this.onInputchange}
                />
                <br />
                <Link
                    to="/"
                    onClick={() => this.callDispatch()}>
                    Create Assignment
                </Link>
            </span>
        </div>
    );
}
}

export default CreateAssignmentComponent;