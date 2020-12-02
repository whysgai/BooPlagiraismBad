import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../store';
import { RouteComponentProps } from 'react-router';
import {createSubmission} from '../../actions/SubmissionAction';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { setCurrentAssignmentFromId } from '../../actions/AssignmentAction';
//import { createSubmission } from './actions/SubmissionAction';

interface MatchParams {
  assignmentId: string,
}

interface PropsType extends RouteComponentProps<MatchParams> {
}

class CreateSubmissionComponent extends React.Component <PropsType, {name: string, files: string[]}> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: '',
          files : []
        };
        this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event : ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    this.setState((state) => {
      return {name: value}
    });
  } 

  callDispatch() {
    store.dispatch(createSubmission('UPLOAD_SUBMISSION', this.state.name, store.getState().AssignmentReducer.currentAssignment, this.state.files))
  }

  componentDidMount() {
    const assignmentId = this.props.match.params.assignmentId
    setCurrentAssignmentFromId('SET_CURRENT_ASSIGNMENT', assignmentId)
      .then((assignmentAction) => store.dispatch(assignmentAction))
  }

  render() {
    const propsUpload = {
      name: 'file',
      multiple: true,
      onChange(info : any) {
        const { status } = info.file;
      },
      beforeUpload : (file: any) : boolean => {
        const reader = new FileReader();
        // Prepares what happens when the reader runs
        reader.onload = (event) => {
          if (!event.target) {
            return false;
          }
          file.text = event.target.result;
          let uploadFiles = this.state.files.concat(file);
          this.setState({
            files: uploadFiles
          });
        };
        // Actually runs the reader, invoking the above
        reader.readAsText(file);        
        return false;
      }
    };

    return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <div style={{textAlign: 'right', paddingRight: '100px', paddingTop: '30px', fontWeight: 'bolder'}}>
                <Link className="btn btn-outline-danger mt-2" to={`/Assignments/${this.props.match.params.assignmentId}/Submissions`}>
                  x 
                </Link>
            </div>
            <h3>Upload Submission to Assignment {store.getState().AssignmentReducer.currentAssignment.name}</h3>
            <br/>
            <span text-align="center">
                <h5>Submission Name:</h5>
                <input name="name" className='submission-name-input' type="text" value={this.state.name} onChange={this.onInputchange}/>
                <Upload {...propsUpload} className='submission-file-input'>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag submission files to this area to upload</p>
                    <p className="ant-upload-hint">Supported file extensions are: .java</p>
                </Upload>      
                <br/>
                <Link className='create-submission-btn btn btn-outline-success mt-2'
                    to={`/Assignments/${this.props.match.params.assignmentId}/Submissions`}
                    onClick={() => this.callDispatch()}>
                    Upload Submission
                </Link>
            </span>
        </div>
    );
}
}

export default CreateSubmissionComponent;