import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../store';
import createSubmission from '../../actions/SubmissionAction';
import Assignment from '../../types/Assignment';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
//import { createSubmission } from './actions/SubmissionAction';

interface PropsType {
  name: string
  files : string[]
}

class CreateSubmissionComponent extends React.Component <PropsType, {name: string, files: string[]}> {
    constructor(props : PropsType) {
        super(props);
        this.state = {
          name: this.props.name,
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
    console.log("Files from callDispatch", this.state.files);
    store.dispatch(createSubmission('UPLOAD_SUBMISSION', this.state.name, store.getState().AssignmentReducer.currentAssignment, this.state.files))
  }

  render() {
    const propsUpload = {
      name: 'file',
      multiple: true,
      onChange(info : any) {
        const { status } = info.file;
        // if (status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
      },
      beforeUpload : (file: any) : boolean => {
        console.log("Reached before upload. File:", file);
        //let uploadFiles = [] as any[];
        // let target = 
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target) {
            console.log("Event target is null, no file to upload.");
            return false;
          }
          file.text = event.target.result;
          //uploadFiles.push(file);
          let uploadFiles = this.state.files.concat(file);
          this.setState({
            files: uploadFiles
          });
          console.log("State files after beforeUpload", this.state.files);
        };
        reader.readAsText(file);        
        return false;
      }
    };

    return (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <div style={{textAlign: 'right', paddingRight: '100px', paddingTop: '30px', fontWeight: 'bolder'}}>
                <Link className="btn btn-outline-danger mt-2" to="/Submissions">
                  x 
                </Link>
            </div>
            <h3>Upload Submission to Assignment {store.getState().AssignmentReducer.currentAssignment.name}</h3>
            <br/>
            <span text-align="center">
                <h5>Submission Name:</h5>
                <input name="name" className='submission-name-input' type="text" value={this.props.name} onChange={this.onInputchange}/>
                <Upload {...propsUpload} className='submission-file-input'>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                      Support for single file upload or bulk upload. 
                    </p>
                </Upload>      
                <br/>
                <Link className='create-submission-btn btn btn-outline-success mt-2'
                    to="/Submissions"
                    onClick={() => this.callDispatch()}>
                    Upload Submission
                </Link>
            </span>
        </div>
    );
}
}

export default CreateSubmissionComponent;