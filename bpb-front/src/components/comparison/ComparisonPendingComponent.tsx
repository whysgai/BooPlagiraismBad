import React from 'react';
import Submission from '../../types/Submission';

/**
 * Props type interface to set the types of any props that are passed from a parent component.
 */
interface PropsType {
  submissionOne: Submission,
  submissionTwo: Submission 
}

/**
 * Renders a message asking the user to wait while the server processes the comparison
 * calculations. Displays the files of each submission as well.
 */
class ComparisonPendingComponent extends React.Component <PropsType, {}> {

    constructor(props : PropsType) {
        super(props);
        
        this.state = {
        };
    }

    render() {
        return(
            <div className="container">
                <div className="card col-12 text-center mt-4">
                    <div className="card-body">
                        <h4 className="card-title">Comparing Submissions</h4>
                        <div className="row mb-3">
                            <div className="col-3"/>
                            <div className="card-subtitle text-justify col-6">
                                Please be patient, as this may take some time.
                                The comparison calculation is dependent on the quantity, size, and complexity of your submission files.
                                Make yourself a cup of tea, create new assignments and submissions, or kick off another comparison.
                                When you come back to this one, it will let you know if it's finished.
                            </div>
                            <div className="col-3"/>
                        </div>
                        <div className="row justify-content-around">
                            {/*Left-hand list of files in submission one*/}                         
                            {
                                (this.props.submissionOne) &&
                                    <div className="col-4">
                                            <ul className="list-group">
                                                <li className="active list-group-item"><h5 className="card-subtitle">{this.props.submissionOne.name} files:</h5></li>     
                                                {
                                                    (this.props.submissionOne && this.props.submissionOne.files.length > 0) &&
                                                    this.props.submissionOne.files.map((file, index) => 
                                                        <li className="card-text list-group-item" key={index}>
                                                            {file}
                                                        </li>
                                                    )
                                                }            
                                            </ul>
                                    </div>
                            }
                            {/*Right-hand list of files in submission two*/}
                            {
                                (this.props.submissionTwo) &&
                                    <div className="col-4">
                                        <ul className="list-group"> 
                                            <li className="active list-group-item"><h5 className="card-subtitle">{this.props.submissionTwo.name} files:</h5></li>           
                                            {
                                                (this.props.submissionTwo && this.props.submissionTwo.files.length > 0) &&
                                                this.props.submissionTwo.files.map((file, index) => 
                                                    <li className="card-text list-group-item" key={index}>
                                                        {file}
                                                    </li>
                                                )
                                            }            
                                        </ul>
                                    </div>
                            }                            
                        </div>
                    </div>  
                </div>
            </div>
        )
    };



}

export default ComparisonPendingComponent;