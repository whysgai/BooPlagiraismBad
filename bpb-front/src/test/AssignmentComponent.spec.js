import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
// import { expect } from "chai";
// import chai from 'chai';
// import { shallow } from "enzyme"
import AssignmentListComponent from "../components/assignment/AssignmentListComponent";
import { StaticRouter } from 'react-router'
import AssignmentListCard from '../components/assignment/AssignmentListCard';
import CreateAssignmentComponent from '../components/assignment/CreateAssignmentComponent';


describe("Assignment unit tests:", () => {
    let container;
    let assignmentOne;
    let assignmentTwo;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        assignmentOne = {
            _id: "001",
            name: "Bruce Wayne"
        };
        assignmentTwo = {
            _id: "002",
            name: "Diana Prince"
        };
    })

    describe("Assignment List Component tests:", () =>{
        it('Should render primary component', () =>{        

            act(() =>{
                render(<StaticRouter location='/Assignments' context={{}}><AssignmentListComponent/></StaticRouter>, container);  
            }); 
            expect(container.getElementsByClassName('assignment-list').length).toBe(1);
        });
        it('Should show a link that directs user to the assignment creation page', () =>{        
    
            act(() =>{
                render(<StaticRouter location='/Assignments' context={{}}><AssignmentListComponent/></StaticRouter>, container);  
            }); 
            expect(container.getElementsByClassName('btn-new-assignment ').length).toBe(1);
            expect(document.querySelector("a").getAttribute("href")).toBe("/CreateAssignment")
        });
    });

    describe("Assignment List Card Component test:", () => {
        it('Should render primary component', () =>{        

            act(() =>{
                render(<StaticRouter location='/Assignments' context={{}}><AssignmentListCard assignment={assignmentOne}/></StaticRouter>, container);  
            }); 
            expect(container.getElementsByClassName('assignment-list-card').length).toBe(1);            
        });
        it('Should render assignment name', () =>{        

            act(() =>{
                render(<StaticRouter location='/Assignments' context={{}}><AssignmentListCard assignment={assignmentOne}/></StaticRouter>, container);  
            }); 
            expect(container.querySelector(".card-title").textContent).toEqual("Bruce Wayne");
        });
        it('Should render assignment view submissions link', () =>{        

            act(() =>{
                render(<StaticRouter location='/Assignments' context={{}}><AssignmentListCard assignment={assignmentOne}/></StaticRouter>, container);  
            }); 
            expect(container.querySelector(".btn-view-submissions").getAttribute("href")).toBe("/Assignments/001/Submissions");
        });
        it('Should render assignment delete button', () =>{        

            act(() =>{
                render(<StaticRouter location='/Assignments' context={{}}><AssignmentListCard assignment={assignmentOne}/></StaticRouter>, container);  
            }); 
            expect(container.querySelector(".btn-delete").textContent).toEqual("Delete");
        });
    });

    describe("Assignment List Creation Component tests:", () =>{
        it('Should render primary component', () =>{        

            act(() =>{
                render(<StaticRouter location='/CreateAssignment' context={{}}><CreateAssignmentComponent/></StaticRouter>, container);  
            }); 
            expect(container.getElementsByClassName('assignment-creation').length).toBe(1);
        });
        it('Should show an empty input box and disabled upload button', () =>{        
    
            act(() =>{
                render(<StaticRouter location='/CreateAssignment' context={{}}><CreateAssignmentComponent/></StaticRouter>, container);  
            }); 
            expect(container.getElementsByClassName('assignment-name-input').length).toBe(1);
            expect(document.querySelector(".assignment-name-input").textContent).toBe("");
            expect(container.getElementsByClassName('create-assignment-btn-disabled').length).toBe(1);
            expect(container.getElementsByClassName('create-assignment-btn').length).toBe(0);
        });
    });

});