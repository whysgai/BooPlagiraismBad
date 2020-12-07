import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
import AssignmentListComponent from "../components/assignment/AssignmentListComponent";
import { StaticRouter } from 'react-router'


describe("AssignmentListComponent tests:", () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        // container.appendChild(<BrowserRouter><Route path="/" /></BrowserRouter>)
        document.body.appendChild(container);

    })


    it('Should display no assignments if none exist', () =>{        

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        }); 

        expect(container.getElementsByClassName('assignment-list').length).toBe(1);
        expect(container.getElementsByClassName('assignment-list-card').length).toBe(0);
    });


    it('Should display one assignments if one exists', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[{_id:"01", name:"Peter Parker"}]}/></StaticRouter>, container);  
        });

        expect(container.getElementsByClassName('assignment-list-card').length).toBe(1);
    });

    it('Should display 3 assignments if 3 exist', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[
                {_id:"02", name:"Gwen Stacey"},
                {_id:"03", name:"Flash Thompson"},
                {_id:"04", name:"Mary Jane Watson"}
            ]}/></StaticRouter>, container);  
        });

        expect(container.getElementsByClassName('assignment-list-card').length).toBe(3);
    });

    it('Should show a link that directs user to the assignment creation page', () => {
        let container = document.createElement('div');
        document.body.appendChild(container);

        act(() =>{
            render(<StaticRouter location='/' context={{}}><AssignmentListComponent assignments={[]}/></StaticRouter>, container);  
        });
        
        expect(document.querySelector("a").getAttribute("href")).toBe("/CreateAssignment")
    });

});