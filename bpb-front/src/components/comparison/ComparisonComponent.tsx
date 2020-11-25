import React from 'react';
import Submission from './types/Submission';

interface PropsType {
  submissions : Submission[]
}

/**
 * Represents a comparison view between two submissions
 */
class ComparisonComponent extends React.Component <PropsType, {}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
      submissions:this.props.submissions
    };
  }

  render() {
    return (
      <div className="submission-compare-pane">
        ComparisonComponent
      </div>
    );
  }
}

export default ComparisonComponent;