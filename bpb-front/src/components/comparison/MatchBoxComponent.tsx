import React from 'react';
import Comparison from '../../types/Comparison';
import Snippet from '../../types/Snippet';
import { selectSnippets } from '../../actions/ComparisonAction';
import { store } from '../../store';

interface PropsType {
  comparison: Comparison
}

/**
 * Represents a document pane which displays the contents of a file of a given submission 
 */
class MatchBoxComponent extends React.Component <PropsType, {}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {

    };
  }

  clickMatch(match: Snippet[]) {
    // Use this to make things happen when you click matches
    store.dispatch(selectSnippets(match));
  }

  render() {
    return (
      <div className="submission-compare-pane border">
        Matches
        {
          (this.props.comparison.matches && this.props.comparison.matches.length > 0) &&
            <ul className="nav flex-column">
              {
                this.props.comparison.matches.map((match, index) => 
                  <li className="nav-item" key={index} onClick={() => this.clickMatch(match)}>
                    <ul>
                      <li className="nav-item-link">Match {index+1}</li>
                      <li>Context {match[0].contextType}</li>
                      <li>{match[0].fileName} lines {match[0].lineNumberStart} - {match[0].lineNumberEnd}</li>
                      <li>{match[1].fileName} lines {match[1].lineNumberStart} - {match[1].lineNumberEnd}</li>
                    </ul>
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