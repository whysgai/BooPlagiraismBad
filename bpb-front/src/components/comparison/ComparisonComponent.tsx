import React from 'react';
import { readFileContent } from '../../actions/ComparisonAction';
import {store} from '../../store'
import Submission from '../../types/Submission';
import DirectoryListComponent from './DirectoryListComponent';
import DocumentPaneComponent from './DocumentPaneComponent';
import MatchListComponent from './MatchListComponent';

interface PropsType {
  //submissions : Submission[]
}

/**
 * Represents a comparison view between two submissions
 */
class ComparisonComponent extends React.Component <PropsType, {
  compareSubmissions: Submission[], comparison: JSON[],
  submissionOne: Submission, submissionTwo: Submission
  // submissionOneFile: String, submissionTwoFile: String
}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
      //submissions:this.props.submissions
      compareSubmissions: store.getState().ComparisonReducer.compareSubmissions,
      comparison: store.getState().ComparisonReducer.comparison,
      submissionOne: store.getState().ComparisonReducer.submissionOne,
      submissionTwo: store.getState().ComparisonReducer.submissionTwo
      // submissionOneFile: this.state.submissionOne.files[0],
      // submissionTwoFile: this.state.submissionTwo.files[0]
      
    };
  }

  componentDidMount() {
    // fetch file contents for sub1F and sub2F?
  }

  fetchFileContent(submissionId: String, submissionIndex: Number, fileIndex: Number) {
    readFileContent(submissionId, submissionIndex, fileIndex)
      .then((comparisonAction) => store.dispatch(comparisonAction))
        // .then(() => {
        //   if(submissionIndex === 1) {
        //     this.setState({
        //       submissionOneFile: store.getState().ComparisonReducer.fileOne
        //     });
        //   }

        // })
  }


  render() {
    return (
      <div className="submission-compare-pane col-12">
        <div className="row">
          <div className="sub1 row col-4">
            <h3 className="col-12">Submission: {this.state.submissionOne.name}</h3>
            <div className="col-4">
              <div className="submission-compare-pane border">
                DirectoryListComponent
                {
                  (this.state.submissionOne.files && this.state.submissionOne.files.length > 0) &&
                    <ol>
                      {
                        this.state.submissionOne.files.map((file, index) => 
                          <li key={index} onClick={() => this.fetchFileContent(this.state.submissionOne._id, 1, index)}>{file}</li>
                        )
                      }
                    </ol>
                } 
              </div>
            </div>
            <div className="col-8">
              <DocumentPaneComponent fileContent={store.getState().ComparisonReducer.fileOneContent}/>
            </div>
          </div>
          <div className="col-4">
              <MatchListComponent/>
          </div>
          <div className="sub2 row col-4">
            <h3 className="col-12">Submission: {this.state.submissionTwo.name}</h3>
            <div className="col-8">
              <DocumentPaneComponent fileContent={store.getState().ComparisonReducer.fileTwoContent}/>
            </div>
            <div className="col-4">
              <div className="submission-compare-pane border">
                  DirectoryListComponent
                  {
                    (this.state.submissionTwo.files && this.state.submissionTwo.files.length > 0) &&
                      <ol>
                        {
                          this.state.submissionTwo.files.map((file, index) => 
                            <li key={index}><a href="#">{file}</a></li>
                          )
                        }
                      </ol>
                  } 
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ComparisonComponent;