import React from 'react';
import Submission from '../../types/Submission';

interface PropsType {
  submissionOne: Submission,
  submissionTwo: Submission 
}

class ComparisonPendingComponent extends React.Component <PropsType, {}> {

    constructor(props : PropsType) {
        super(props);
        
        this.state = {
        };
    }

    render() {
        return(
            <div className="container">
                <div className="card col-12 text-center">
                    <div className="card-body">
                        <h4 className="card-title">Comparing Submissions</h4>
                        <div className="row">
                            <div className="col-3"/>
                            <div className="card-subtitle col-6">Please be patient, this may take Some time. It depends on the quantity, size, and complexity of your submission files.</div>
                            <div className="col-3"/>
                        </div>                        
                        <div className="row justify-content-around">
                            <div className="col-4">
                                <h5 className="card-subtitle">{this.props.submissionOne.name} files:</h5>
                                <ul>            
                                        {
                                            (this.props.submissionOne && this.props.submissionOne.files.length > 0) &&
                                            this.props.submissionOne.files.map((file, index) => 
                                                <li className="card-text" key={index}>
                                                    {file}
                                                </li>
                                            )
                                        }            
                                </ul>
                            </div>
                            <div className="col-4">
                                <h5 className="card-subtitle">{this.props.submissionTwo.name} files:</h5>
                                <ul>            
                                        {
                                            (this.props.submissionTwo && this.props.submissionTwo.files.length > 0) &&
                                            this.props.submissionTwo.files.map((file, index) => 
                                                <li className="card-text" key={index}>
                                                    {file}
                                                </li>
                                            )
                                        }            
                                </ul>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        )
    };



}

export default ComparisonPendingComponent;