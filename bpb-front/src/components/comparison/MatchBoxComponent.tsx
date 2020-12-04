import React from 'react';
import Comparison from '../../types/Comparison';

interface PropsType {
  comparison: Comparison
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
          console.log("Logging matches from component", this.props.comparison)
        }
        HighlightsForProfessors
        {
          (this.props.comparison.matches && this.props.comparison.matches.length > 0) &&
            <ul className="nav flex-column">
              {
                this.props.comparison.matches.map((match, index) => 
                  <li className="nav-item" key={index}><span className="nav-item-link">{index+1}</span></li>
                )
              }
            </ul>
        }
      </div>
    );
  }
}

export default MatchBoxComponent;