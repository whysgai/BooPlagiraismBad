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
    {
      console.log("Document pane file snippet",this.props.snippet)
    }
    return (
      <div className="submission-compare-pane border">
        <span>{this.props.snippet? this.props.snippet.fileName:''}</span>
        <pre>
          {
            (this.props.fileContent && this.props.fileContent !== "") &&
              this.props.fileContent.split(/\r?\n/).map((line, index) => 
                <div>                  
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