import React from 'react';

interface PropsType {
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
      <div className="submission-compare-pane">
        DocumentPaneComponent
      </div>
    );
  }
}

export default DocumentPaneComponent;