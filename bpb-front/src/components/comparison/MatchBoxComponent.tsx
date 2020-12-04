import React from 'react';
import Comparison from '../../types/Comparison';
import Snippet from '../../types/Snippet';

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

  clickMatch(match: Snippet[]) {
    // Use this to make things happen when you click matches
    console.log("This is a match between files" + match[0].fileName + " and " + match[1].fileName + " on " + match[0].text + " and " + match[1].text)
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
                  <li className="nav-item" key={index} onClick={() => this.clickMatch(match)}>
                    <span className="nav-item-link">Match {index+1}</span>
                    <span>Context {match[0].contextType}</span>
                    <span>{match[0].fileName} lines {match[0].lineNumberStart} - {match[0].lineNumberEnd}</span>
                    <span>{match[1].fileName} lines {match[1].lineNumberStart} - {match[1].lineNumberEnd}</span>

                  </li>
                )
              }
            </ul>
        }
      </div>
    );
  }
}

export default MatchBoxComponent;