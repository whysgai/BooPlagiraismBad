import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { clearComparisonSubmissions, compareSubmissions, readComparisonSubmission, readFileContent } from '../../actions/ComparisonAction';
import {store} from '../../store'
import Submission from '../../types/Submission';
import DocumentPaneComponent from './DocumentPaneComponent';
import MatchBoxComponent from './MatchBoxComponent';
import Comparison from '../../types/Comparison';
import ComparisonPendingComponent from './ComparisonPendingComponent';
import Snippet from '../../types/Snippet';

/**
 * Constructor type interface to set the types of class properties
 */
interface ConstructorType {
  compareSubmissions: Submission[],
  comparisons: Comparison[],
  submissionOne: Submission,
  submissionTwo: Submission
  subOneFileContents: String[], 
  subTwoFileContents: String[],
  submissionOneFileContent: String, 
  submissionTwoFileContent: String,
  activeFileOne: String, 
  activeFileTwo: String, 
  activeMatches: Comparison,
  comparisonIsReady: boolean, 
  submissionOneDisplaySnippet: Snippet, 
  submissionTwoDisplaySnippet: Snippet
}

/**
 * MatchParams type interface to set the types of any paramaters encoded in the URL.
 */
interface MatchParams {
  assignmentId: string,
  subIdOne: string,
  subIdTwo: string
}

/**
 * Props type interface to set the types of any props that are passed from a parent component.
 */
interface PropsType extends RouteComponentProps<MatchParams> {
}

/**
 * Renders a comparison view between two submissions
 */
class ComparisonComponent extends React.Component <PropsType, ConstructorType> {

  constructor(props : PropsType) {
    super(props);
    
    this.state = {
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
      comparisonIsReady: false,
      submissionOneDisplaySnippet: {} as Snippet,
      submissionTwoDisplaySnippet: {} as Snippet,
    };
  }

  /**
   * Runs when the page finishes loading, and contains the necessary requests to re-populate the store
   * from the server. Fetches the two submissions encoded in the url and requests a comparison and
   * their file contents. Utilizes promise-chaining to increase efficiency.
   */
  componentDidMount() {
    // First, clear the store of the compareSubmissions array, in case user navigated here
    // Using foward/back after filling the store with different comparisons
    store.dispatch(clearComparisonSubmissions());
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
            compareSubmissions(store.getState().ComparisonReducer.compareSubmissions)
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

  /**
  * The server returns all sets of file-to-file matches, but we only want to display them for
  * one file pair at a time. This function filters to make sure we are seeing the correct set
  * of matches by making sure the left file we are showing matches the left file of the pair,
  * and the same for the right side.
  */
  filterMatches() {
    if (this.state.activeFileOne != "" && this.state.activeFileTwo != "") {
      let parseObjects = this.state.comparisons as any as any[] as Comparison[];
      this.setState({
        activeMatches: parseObjects.filter((arrayMatch) => {
          let match = arrayMatch as any as Comparison
          return (match.files[0][1] === this.state.activeFileOne) &&
          (match.files[1][1] === this.state.activeFileTwo)
        })[0] as any as any as Comparison
      });
    }
  }

  /**
  * When a file is selected, updates the displayed file content accordingly
  * @param submissionIndex indicating whether the submission is on the left or right
  * @param fileIndex the position of the file in the submission's list
  */
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

  /**
  * When a match is selected, updates the displayed file content accordingly
  * by pulling from the store (which was in turn set within the MatchBox component)
  */
  selectComparisonForFiles() {
    this.setState({
      submissionOneDisplaySnippet: store.getState().ComparisonReducer.snippetFileOne,
      submissionTwoDisplaySnippet: store.getState().ComparisonReducer.snippetFileTwo
    })
  }

  /**
  * Removes the current match, returning the displays to the full files
  */
  resetCurrentMatch() {
    this.setState({
      submissionOneDisplaySnippet: {} as Snippet,
      submissionTwoDisplaySnippet: {} as Snippet
    })
  }

  render() {
    return (
      <div>
        {          
          this.state.comparisonIsReady &&
            <div className="submission-compare-pane col-12">
              <div>
              </div>
              <div className="row col-12">
                <div className="col-1"></div>
                <h3 className="col-3 text-right pr-10">Submission: {this.state.submissionOne.name}</h3>
                <div className="col-4 mb-4 no-gutters">
                  <div className="card text-center ">
                    <div className="card-header">Top 5 Prominent Matches</div>
                    <div className="card-body"> 
                      {
                        (this.state.comparisons && this.state.comparisons.length > 0) &&
                          <ul className="pl-0 mb-0">
                            {
                              this.state.comparisons.slice(0, 5).map((comparison, index) => 
                                <li key={index} className="d-inline"> &middot; {comparison.files[0][1]} &amp; {comparison.files[1][1]} : {(comparison.similarityScore * 100).toFixed(2)}%</li>
                              )
                            }
                          </ul>  
                      }
                      {
                        (this.state.comparisons && this.state.comparisons.length <= 0) &&
                          <span>There are no matches detected between these submissions.</span>
                      }
                    </div>
                  </div>
                </div>   
                <h3 className="col-3 pl-10">Submission: {this.state.submissionTwo.name}</h3>
                <div className="col-1 float-right">
                  <Link className="btn btn-outline-danger mt-2 mw-100" to={`/Assignments/${this.props.match.params.assignmentId}/Submissions`}>
                    <i className="fa fa-window-close-o" aria-hidden="true"></i> 
                  </Link>
                </div>
              </div> 
              <div className="row col-12 align-items-start">
                  
                <div className="sub1 row col-5">
                  {/* Left Directory List */}
                  <div className="directory-list col-3">
                    {
                      (this.state.submissionOne.files && this.state.submissionOne.files.length > 0) &&
                        <ul className="list-group">
                          {
                            this.state.submissionOne.files.map((file, index) => 
                              <li key={index}
                                className={`${this.state.activeFileOne === file ? "active" : ""} list-group-item`}                                  
                                onClick={() => {this.showFileContent(1, index); this.resetCurrentMatch()}}>
                                <a href="#" className={`${this.state.activeFileOne === file ? "text-white" : ""} text-decoration-none  text-wrap`}>{file}</a>
                              </li>
                            )
                          }
                        </ul>
                    } 
                  </div>  
                  {/* Left Document Pane */}
                  <div className="col-9">
                    <span></span>
                    <DocumentPaneComponent fileContent={this.state.submissionOneFileContent} snippet={this.state.submissionOneDisplaySnippet} side={0} highlights={this.state.activeMatches} />
                  </div>
                </div>
                <div className="col-2">
                  <div className={`btn btn-outline-info col-12 ${(!this.state.submissionOneDisplaySnippet.fileName || !this.state.submissionTwoDisplaySnippet.fileName)? "d-none" : ""}`} onClick={() => this.resetCurrentMatch()}>Clear Match</div>
                  <div onClick={() => this.selectComparisonForFiles()}>
                    <MatchBoxComponent comparison={this.state.activeMatches} />
                  </div>
                </div>
                <div className="sub2 row col-5">
                  {/* Right Document Pane */}
                  <div className="col-9">
                    <DocumentPaneComponent fileContent={this.state.submissionTwoFileContent} snippet={this.state.submissionTwoDisplaySnippet} side={1} highlights={this.state.activeMatches}/>
                  </div>
                  {/* Right Directory List */}
                  <div className="directory-list col-3">
                      {
                        (this.state.submissionTwo.files && this.state.submissionTwo.files.length > 0) &&
                          <ul className="list-group">
                            {
                              this.state.submissionTwo.files.map((file, index) => 
                                <li key={index}
                                  className={`${this.state.activeFileTwo === file ? "active" : ""} list-group-item`}
                                  onClick={() => {this.showFileContent(2, index); this.resetCurrentMatch()}}>
                                  <a href="#" className={`${this.state.activeFileTwo === file ? "text-white" : ""} text-decoration-none text-wrap`}>{file}</a>
                                </li>
                              )
                            }
                          </ul>
                      } 
                    </div>
                  
                </div>
              </div>
            </div>  
        }
        {/* If the comparison has not returned from the server, display this message. */}
        {
          !this.state.comparisonIsReady &&
            <ComparisonPendingComponent submissionOne={this.state.submissionOne} submissionTwo={this.state.submissionTwo}/>
        }
      </div>                  
    );
  }
}

export default ComparisonComponent;