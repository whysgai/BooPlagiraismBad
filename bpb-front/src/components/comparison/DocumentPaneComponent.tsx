import React from 'react';
import Comparison from '../../types/Comparison';
import Snippet from '../../types/Snippet';
import '../../css/MatchHighlightStyle.css';

interface PropsType {
  fileContent: String,
  snippet: Snippet,
  highlights: Comparison,
  side: number
}

/**
 * Represents a document pane which displays the contents of a file of a given submission 
 */
class DocumentPaneComponent extends React.Component <PropsType, {}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {

    };
  }

  isHighlight(lineNumber : number) {
    if (this.props.highlights.matches && this.props.highlights.matches.length > 0) {
      if (this.props.snippet.submissionId === undefined) {
        let match : Snippet[]
        for (match of this.props.highlights.matches) {
          if (lineNumber+1 >= match[this.props.side].lineNumberStart && lineNumber+1 <= match[this.props.side].lineNumberEnd) {
            return true;
          } else {
            return false
          }
        }
      } else {
        return false;
      }
    }
  }

  render() {
    return (
      <div className="submission-compare-pane border">
        <pre>
          {
            (this.props.fileContent && this.props.fileContent !== "") &&
              this.props.fileContent.split(/\r?\n/).map((line, index) => 
                <div className={`${
                    ((this.props.snippet.submissionId === undefined) || (index+1 >= this.props.snippet.lineNumberStart && index+1 <= this.props.snippet.lineNumberEnd))? "" : "d-none"
                  }`} key={index}>
                    <span className="bg-light">{index} </span>
                    <span key={index} className={`${this.isHighlight(index)? "highlight":""}`}>{line}</span>                  
                </div>
              )
          }
        </pre>        
      </div>
    );
  }
}

export default DocumentPaneComponent;