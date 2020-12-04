import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { compareSubmissions, readComparisonSubmission, readFileContent } from '../../actions/ComparisonAction';
import {store} from '../../store'
import Submission from '../../types/Submission';
import DirectoryListComponent from './DirectoryListComponent';
import DocumentPaneComponent from './DocumentPaneComponent';
import MatchBoxComponent from './MatchBoxComponent';
import Comparison from '../../types/Comparison';
import ComparisonPendingComponent from './ComparisonPendingComponent';

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
  compareSubmissions: Submission[], comparisons: JSON[],
  submissionOne: Submission, submissionTwo: Submission
  subOneFileContents: String[], subTwoFileContents: String[]
  submissionOneFileContent: String, submissionTwoFileContent: String,
  activeFileOne: String, activeFileTwo: String, activeMatches: Comparison,
  comparisonIsReady: boolean
}> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
      //submissions:this.props.submissions
      compareSubmissions: store.getState().ComparisonReducer.compareSubmissions,
      comparisons: store.getState().ComparisonReducer.comparisons,
      submissionOne: store.getState().ComparisonReducer.compareSubmissions[0],
      submissionTwo: store.getState().ComparisonReducer.compareSubmissions[1],
      subOneFileContents: store.getState().ComparisonReducer.subOneFileContents,
      subTwoFileContents: store.getState().ComparisonReducer.subTwoFileContents,
      submissionOneFileContent: "",
      submissionTwoFileContent: "",
      activeFileOne: "",
      activeFileTwo: "",
      activeMatches: {} as Comparison,
      comparisonIsReady: false
    };
  }

  componentDidMount() {
    console.log("Did mount");
    // Get first submission based on its ID in the url
    readComparisonSubmission(this.props.match.params.subIdOne)
      .then((submissionAction) => store.dispatch(submissionAction))
      .then(() => {
        this.setState({
          submissionOne: store.getState().ComparisonReducer.compareSubmissions[0],
        })
      }).then(() => {
        // Get first submission based on its ID in the url
        readComparisonSubmission(this.props.match.params.subIdTwo)
        .then((submissionAction) => store.dispatch(submissionAction))
        .then(() => {
          this.setState({
            submissionTwo: store.getState().ComparisonReducer.compareSubmissions[1],
          })
        }).then(() => {
          // now that we have BOTH subs in state, compare them and fetch their files
          // Promise.all().then(() => {
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
            compareSubmissions(this.state.compareSubmissions)
              .then((comparisonAction) => store.dispatch(comparisonAction))
              .then(() => {
                  this.setState({
                    comparisons: store.getState().ComparisonReducer.comparisons
                  });
                  setTimeout(() => {
                    this.setState({
                      comparisonIsReady: true
                    });
                  }, 100);
              });          
        })
      })
  }

  filterMatches() {
    if (this.state.activeFileOne != "" && this.state.activeFileTwo != "") {
      let parseObjects = this.state.comparisons as any as any[] as Comparison[]
      console.log("Parse Objects", parseObjects)
      this.setState({
        activeMatches: parseObjects.filter((arrayMatch) => {
          let match = arrayMatch as any as Comparison
          return (match.files[0][1] === this.state.activeFileOne || match.files[1][1] === this.state.activeFileOne) &&
          (match.files[0][1] === this.state.activeFileTwo || match.files[1][1] === this.state.activeFileTwo)
        })[0] as any as any as Comparison
      })
    }
    console.log("Active Matches", this.state.activeMatches)
  }

  showFileContent(submissionIndex: number, fileIndex: number) {
    if (submissionIndex === 1) {
      this.setState({
        activeFileOne: this.state.submissionOne.files[fileIndex],        
        submissionOneFileContent: this.state.subOneFileContents[fileIndex]
      });
    } else {
      this.setState({
        activeFileTwo: this.state.submissionTwo.files[fileIndex],
        submissionTwoFileContent: this.state.subTwoFileContents[fileIndex]
      });
    }
    setTimeout(() => {this.filterMatches()}, 500);
  }

  selectComparisonForFiles() {}


  render() {
    return (
      <div>
        {          
          this.state.comparisonIsReady &&
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
                <h3 className="col-6">Submission: {this.state.submissionOne.name}</h3>
                <h3 className="col-6">Submission: {this.state.submissionTwo.name}</h3>
              </div>   
            <div className="row col-12 align-items-start">
        
              <div className="sub1 row col-4 ">
                
                <div className="col-3">
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
                <div className="col-9">
                  <DocumentPaneComponent fileContent={this.state.submissionOneFileContent}/>
                </div>
              </div>
              <div className="col-3">
                  <MatchBoxComponent comparison={this.state.activeMatches}/>
              </div>
              <div className="sub2 row col-4">
                
                <div className="col-9">
                  <DocumentPaneComponent fileContent={this.state.submissionTwoFileContent}/>
                </div>
                <div className="col-3">
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
        }
        {
          !this.state.comparisonIsReady &&
            <ComparisonPendingComponent submissionOne={this.state.submissionOne} submissionTwo={this.state.submissionTwo}/>
        }
      </div>
                  
    );
  }
}

export default ComparisonComponent;