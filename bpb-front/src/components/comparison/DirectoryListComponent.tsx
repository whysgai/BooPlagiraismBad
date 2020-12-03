import React from 'react';

interface PropsType {
  files: String[];
  activeFileName: String;
}

/**
 * Represents a view of a list of submission files 
 */
class DirectoryListComponent extends React.Component <PropsType, {files: String[]}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
      files: this.props.files
    };
  }

  render() {
    return (
      <div className="submission-compare-pane border">
       DirectoryListComponent
       {
         (this.state.files && this.state.files.length > 0) &&
          <ol>
            {
              this.state.files.map((file, index) => 
                <li key={index}><a href="#">{file}</a></li>
                //<li key={index}>thing</li>
              )
            }
          </ol>
       } 
      </div>
    );
  }
}

export default DirectoryListComponent;