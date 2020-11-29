import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
import { StaticRouter } from 'react-router'
import SubmissionListComponent from '../components/submission/SubmissionListComponent';
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store'
import CreateAssignmentComponent from '../components/assignment/CreateAssignmentComponent';

describe("CreateAssignmentComponent tests:", () => {
    let container;
    let mockStore;
    beforeEach(() => {
        container = document.createElement('div');
        // container.appendChild(<BrowserRouter><Route path="/" /></BrowserRouter>)
        document.body.appendChild(container);
        Enzyme.configure({ adapter: new Adapter() })
        mockStore = configureMockStore([])
    })
    it('Should display assignment name field', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><CreateAssignmentComponent/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('assignment-name-input').length).toBe(1);
    });
    it('Should display SubmitButton', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><CreateAssignmentComponent/></StaticRouter>, container);
        });
        expect(container.querySelector('.create-assignment-btn').getAttribute('href')).toBe('/');
    });
    //Skipping because button clicks don't work in testing
    it.skip('Should trigger assignment creation if assignment name field is filled when clicked', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('assignment-list-item').length).toBe(0);
    });
    //Skipping because button clicks don't work in testing
    it.skip('Should not trigger assignment creation if assignment name field is empty when clicked', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('assignment-list-item').length).toBe(0);
    });
});