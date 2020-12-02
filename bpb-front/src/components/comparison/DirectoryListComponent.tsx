import React from 'react';

interface PropsType {
}

/**
 * Represents a view of a list of submission files 
 */
class DirectoryListComponent extends React.Component <PropsType, {}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
    };
  }

  render() {
    return (
      <div className="submission-compare-pane">
       DirectoryListComponent 
      </div>
    );
  }
}

export default DirectoryListComponent;