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

  selectMatch(match: Snippet[]) {
    store.dispatch(selectSnippets(match));
  }

  render() {
    return (
      <div className="submission-compare-pane border">
        {
          (this.props.comparison.matches && this.props.comparison.matches.length <= 0) &&
            <span>No matches found.</span>            
        }        
        {
          (this.props.comparison.matches && this.props.comparison.matches.length > 0 && this.props.comparison.similarityScore < 1) &&
            <div>
              <div className="col-12 text-align-center">File similarity: {(this.props.comparison.similarityScore * 100).toFixed(2)}%</div>
              <div className="col-12 text-align-center">Matches:</div>
              <ul className="nav flex-column col-12">
                {
                  this.props.comparison.matches.slice(0, 10).map((match, index) => 
                    <li className="nav-item" key={index} onClick={() => this.selectMatch(match)}>
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
            </div>            
        }
        {
          (this.props.comparison.matches && this.props.comparison.matches.length > 0 && this.props.comparison.similarityScore >= 1) &&
            <div className="col-12 text-align-center">File similarity: {(this.props.comparison.similarityScore * 100).toFixed(2)}%</div>
        }
      </div>
    );
  }
}

export default MatchBoxComponent;