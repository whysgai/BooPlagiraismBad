import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import { act } from "react-dom/test-utils";
import SubmissionListItemComponent from "../SubmissionListItemComponent";
import BrowserRouter from "react-router-dom";
import Route from "react-router-dom";
import { StaticRouter } from 'react-router'
import SubmissionListComponent from '../SubmissionListComponent';


describe("SubmissionListComponent tests:", () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        // container.appendChild(<BrowserRouter><Route path="/" /></BrowserRouter>)
        document.body.appendChild(container);

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

    //TODO: does this test make sense??
    it.skip('Should display a single submission if only one exists for the specified assignment', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        //TODO
        expect(document.querySelector("a").getAttribute("href")).toBe("/")
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

    //TODO
    it.skip('Should not be clickable and should show 0 when no submissions are selected', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        //TODO
        expect(document.querySelector("a").getAttribute("href")).toBe("/")
    });

    //TODO
    it.skip('Should not be clickable and should show 1 when one submission is selected', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        //TODO
        expect(document.querySelector("a").getAttribute("href")).toBe("/")
    });

    //TODO
    it.skip('Should be clickable and should show 2 when two submissions are selected', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        //TODO
        expect(document.querySelector("a").getAttribute("href")).toBe("/")
    });

    //TODO
    it.skip('Should take user to ComparisonComponent when clicked', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        //TODO
        expect(document.querySelector("a").getAttribute("href")).toBe("/")
    });

    //TODO
    it.skip('Should not be clickable and should show 0 when no submissions are selected', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        //TODO
        expect(document.querySelector("a").getAttribute("href")).toBe("/")
    });

});