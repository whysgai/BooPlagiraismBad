import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
import { StaticRouter } from 'react-router'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store'
import CreateSubmissionComponent from '../components/submission/CreateSubmissionComponent';

describe("CreateSubmissionComponent tests:", () => {
    let container;
    let mockStore;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        Enzyme.configure({ adapter: new Adapter() })
        mockStore = configureMockStore([])
    })
    it('Should display submission name field', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><CreateSubmissionComponent/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-name-input').length).toBe(1);
    });
    it('Should display Upload Submission Button', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><CreateSubmissionComponent/></StaticRouter>, container);
        });
        expect(container.querySelector('.create-submission-btn').getAttribute('href')).toBe('/');
    });
    it('Should display Upload Files drag and drop section', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><CreateSubmissionComponent/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-file-input').length).toBe(1);
    });
});