import React from 'react';

interface PropsType {
  fileContent: String 
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
      console.log("Document pane file content",this.props.fileContent)
    }
    return (
      <div className="submission-compare-pane border">
        {
          (this.props.fileContent && this.props.fileContent !== "") &&
            this.props.fileContent.split(/\r?\n/).map((line, index) => 
              <div>
                <pre>
                  <span className="bg-light">{index} </span>
                  <span key={index}>{line}</span>
                </pre>
              </div>              
            )
        }
        
      </div>
    );
  }
}

export default DocumentPaneComponent;