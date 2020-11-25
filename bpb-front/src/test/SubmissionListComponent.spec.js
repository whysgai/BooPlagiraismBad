import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
import { StaticRouter } from 'react-router'
import SubmissionListComponent from '../SubmissionListComponent';
import { mount} from 'enzyme'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store'

describe("SubmissionListComponent tests:", () => {
    let container;
    let mockStore;
    beforeEach(() => {
        container = document.createElement('div');
        // container.appendChild(<BrowserRouter><Route path="/" /></BrowserRouter>)
        document.body.appendChild(container);
        Enzyme.configure({ adapter: new Adapter() })
        mockStore = configureMockStore([])
    })
    it('Should display no submissions if none exist for the specified assignment', () =>{
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('assignment-list-item').length).toBe(0);
    });
    it('Should display all existing submissions for the specified assignment', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[1,2,3,4]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('submission-list-item').length).toBe(4);
    });
    //TDOO: does this test make sense??
    it.skip('Should display an error page  if the specified assignment doesn’t exist', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[1]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('submission-list-item').length).toBe(1);
    });
    //TODO
    it('Should display a single submission if only one exists for the specified assignment', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[1]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('submission-list-item').length).toBe(1);
    });
    it('Should display all submissions if one or more submissions exist for the specified assignment', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[1,2,3,4]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('submission-list-item').length).toBe(4);
    });
    it('Should display a link that directs the user to the submission upload page', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[1,2,3,4]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('submission-list-item').length).toBe(4);
        expect(document.querySelector("a").getAttribute("href")).toBe("/CreateSubmissionComponent")
    });
    it('Should display SubmissionCompareButton', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);
        act(() =>{
            render(<StaticRouter location='/' context={{}}><SubmissionListComponent submissions={[1,2,3,4]}/></StaticRouter>, container);
        });
        expect(container.getElementsByClassName('submission-list').length).toBe(1);
        expect(container.getElementsByClassName('submission-list-item').length).toBe(4);
        expect(document.querySelector('.disabledCompareButton').getAttribute('href')).toBe('/ComparisonComponent')
    });
})
describe("CompareButton tests:", () => {
    let container;
    let mockStore;
    beforeEach(() => {
        container = document.createElement('div');
        // container.appendChild(<BrowserRouter><Route path="/" /></BrowserRouter>)
        document.body.appendChild(container);
        Enzyme.configure({ adapter: new Adapter() })
    })
    it('Should not be clickable and should show 0 when no submissions are selected', async() => {
        mockStore = configureMockStore()
        const jestFn = jest.fn();
        const wrapper = mount(<StaticRouter location="/" context={{}}><SubmissionListComponent submissions={[1,2]}/></StaticRouter>);
        const store = mockStore({ compareSubmissions: [] });
        let count = 0;
        wrapper.find("Link#zeroCompare").simulate('click', {
            preventDefault: () => {
                count ++;
            }
           });
        expect(count).toEqual(1);
        expect(store.getState().compareSubmissions.length).toEqual(0);
        wrapper.unmount();
    });
    it('Should not be clickable and should show 1 when one submission is selected', async() => {
        let mocStore = configureMockStore()
        const jestFn = jest.fn();
        const wrapper = mount(<StaticRouter location="/" context={{}}><SubmissionListComponent submissions={[1]}/></StaticRouter> );
        let count = 0;
        let store = mocStore({ compareSubmissions: [1] });
        wrapper.find(".form-check-input").simulate('click');
        wrapper.find("Link#oneCompare").simulate('click', {
            preventDefault: () => {
                count ++;
            }
           });
        expect(count).toEqual(1);
        expect(store.getState().compareSubmissions.length).toEqual(1);
        wrapper.unmount();
    });
    it.skip('Should be clickable and should show 2 when two submissions are selected', async() => {
        let mockStore = configureMockStore()
        const jestFn = jest.fn();
        const wrapper = mount(<StaticRouter location="/" context={{}}><SubmissionListComponent submissions={[1,2]}/></StaticRouter> );
        const store = mockStore({ compareSubmissions: [1,2] });
        let count = 0;
        let count2 = 0;

        const components = Array.from(wrapper.find(".form-check-input"));
        // console.log(components)
        components.forEach(c => c.simulate('click'))
        // wrapper.find(".form-check-input").get(0).simulate('click')
        // console.log(wrapper.find(".form-check-input").at(0))
        // wrapper.find(".form-check-input").get(1).simulate('click')
        //console.log(click)
        // for (test in components) {
        //     console.log('hi')
        //     count2 ++;
        //     test.simulate('click');
        // }
        expect(count2).toEqual(2);
        wrapper.find("Link#twoCompare").simulate('click', {
            preventDefault: () => {
                count ++;
            }
           });
        expect(count).toEqual(1);
        expect(store.getState().compareSubmissions.length).toEqual(2);
        wrapper.unmount();
    });
    it.skip('Should take user to ComparisonComponent when clicked', async() => {
        let mocStore = configureMockStore()
        const jestFn = jest.fn();
        const wrapper = mount(<StaticRouter location="/" context={{}}><SubmissionListComponent submissions={[1,2]}/></StaticRouter> );
        const store = mocStore({ compareSubmissions: [1,2] });
        expect(wrapper.find("a").get(2)).toBe("/ComparisonComponent");
        wrapper.unmount();
    });
});