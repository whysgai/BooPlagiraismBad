import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { readFileContent } from '../../actions/ComparisonAction';
import {store} from '../../store'
import Submission from '../../types/Submission';
import DirectoryListComponent from './DirectoryListComponent';
import DocumentPaneComponent from './DocumentPaneComponent';
import MatchListComponent from './MatchListComponent';


interface MatchParams {
  assignmentId: string,
  subIdOne: string,
  subIdTwo: string
}

interface PropsType extends RouteComponentProps<MatchParams> {
  //submissions : Submission[]
}

/**
 * Represents a comparison view between two submissions
 */
class ComparisonComponent extends React.Component <PropsType, {
  compareSubmissions: Submission[], comparison: JSON[],
  submissionOne: Submission, submissionTwo: Submission
  subOneFileContents: String[], subTwoFileContents: String[]
  submissionOneFileContent: String, submissionTwoFileContent: String,
  activeFileOne: String, activeFileTwo: String
}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
      //submissions:this.props.submissions
      compareSubmissions: store.getState().ComparisonReducer.compareSubmissions,
      comparison: store.getState().ComparisonReducer.comparison,
      submissionOne: store.getState().ComparisonReducer.submissionOne,
      submissionTwo: store.getState().ComparisonReducer.submissionTwo,
      subOneFileContents: store.getState().ComparisonReducer.subOneFileContents,
      subTwoFileContents: store.getState().ComparisonReducer.subTwoFileContents,
      submissionOneFileContent: "",
      submissionTwoFileContent: "",
      activeFileOne: "",
      activeFileTwo: "",      
    };
  }

  componentDidMount() {
    // fetch file contents for sub1 and sub2?
    readFileContent(this.state.submissionOne, 'GET_SUB_ONE_FILES')
      .then((comparisonAction) => store.dispatch(comparisonAction))
      .then(() => this.setState({
        subOneFileContents: store.getState().ComparisonReducer.fileOneContents
      }));

    readFileContent(this.state.submissionTwo, 'GET_SUB_TWO_FILES')
      .then((comparisonAction) => store.dispatch(comparisonAction))
        .then(() => this.setState({
          subTwoFileContents: store.getState().ComparisonReducer.fileTwoContents
        }));
  }


  showFileContent(submissionIndex: number, fileIndex: number) {
    if (submissionIndex === 1) {
      this.setState({
        activeFileOne: this.state.submissionOne.files[fileIndex],        
        submissionOneFileContent: this.state.subOneFileContents[fileIndex]
      });
      console.log("Active file left", this.state.activeFileOne);
    } else {
      this.setState({
        activeFileTwo: this.state.submissionTwo.files[fileIndex],
        submissionTwoFileContent: this.state.subTwoFileContents[fileIndex]
      });
      console.log("Active file right", this.state.activeFileTwo);
    }
  }

  selectComparisonForFiles() {}


  render() {
    return (
      <div className="submission-compare-pane col-12">
        <div>
          <div className="col-10"></div>
          <div className="col-2 float-right">
                <Link className="btn btn-outline-danger mt-2" to={`/Assignments/${this.props.match.params.assignmentId}/Submissions`}>
                  x 
                </Link>
            </div>
        </div>
        <div className="row col-12">
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
                          <li key={index} onClick={() => this.showFileContent(1, index)}>
                            <a href="#" className={`${this.state.activeFileOne === file ? "text-secondary" : "text-primary"}`}>{file}</a>
                          </li>
                        )
                      }
                    </ol>
                } 
              </div>
            </div>
            <div className="col-8">
              <DocumentPaneComponent fileContent={this.state.submissionOneFileContent}/>
            </div>
          </div>
          <div className="col-4">
              <MatchListComponent/>
          </div>
          <div className="sub2 row col-4">
            <h3 className="col-12">Submission: {this.state.submissionTwo.name}</h3>
            <div className="col-8">
              <DocumentPaneComponent fileContent={this.state.submissionTwoFileContent}/>
            </div>
            <div className="col-4">
              <div className="submission-compare-pane border">
                  DirectoryListComponent
                  {
                    (this.state.submissionTwo.files && this.state.submissionTwo.files.length > 0) &&
                      <ol>
                        {
                          this.state.submissionTwo.files.map((file, index) => 
                            <li key={index} onClick={() => this.showFileContent(2, index)}>
                              <a href="#" className={`${this.state.activeFileTwo === file ? "text-secondary" : "text-primary"}`}>{file}</a>
                            </li>
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