import React from 'react';
import Matches from '../../types/Matches';

interface PropsType {
  matches: Matches
}

/**
 * Represents a document pane which displays the contents of a file of a given submission 
 */
class MatchBoxComponent extends React.Component <PropsType, {}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = { };
  }

  render() {
    return (
      <div className="submission-compare-pane border">
        {
          console.log("Logging matches from component", this.props.matches)
        }
        HighlightsForProfessors
      </div>
    );
  }
}

export default MatchBoxComponent;