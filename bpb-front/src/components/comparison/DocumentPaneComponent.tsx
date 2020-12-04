import React from 'react';
import Snippet from '../../types/Snippet';

interface PropsType {
  fileContent: String
  snippet: Snippet
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

  render() {
    return (
      <div className="submission-compare-pane border">
        <pre>

          {
            (this.props.fileContent && this.props.fileContent !== "") &&
              this.props.fileContent.split(/\r?\n/).map((line, index) => 
                <div className={`${
                    ((this.props.snippet.submissionId === undefined) || (index+1 >= this.props.snippet.lineNumberStart && index+1 <= this.props.snippet.lineNumberEnd))? "" : "d-none"
                  }`}>
                    <span className="bg-light">{index} </span>
                    <span key={index}>{line}</span>                  
                </div>
              )
          }
        </pre>        
      </div>
    );
  }
}

export default DocumentPaneComponent;