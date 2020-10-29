import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import { act } from "react-dom/test-utils";
import AssignmentListComponent from "../AssignmentListComponent";

it('something or other callback', () => {
    expect(true).toBe(true);
});

it('Should display no assignments if none exist', () =>{
    let container = document.createElement('div');
    document.body.appendChild(container);

    act(() =>{
        render(<AssignmentListComponent/>, container);
    });

    expect(container.getElementsByClassName('assignment-card').length).toBe(0);
});

it('Should display one assignments if one exists', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);

    act(() =>{
        render(<AssignmentListComponent/>, container);
    });

    expect(container.getElementsByClassName('assignment-card').length).toBe(1);
});

it('Should display 3 assignments if 3 exists', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);

    act(() =>{
        render(<AssignmentListComponent/>, container);
    });

    expect(container.getElementsByClassName('assignment-card').length).toBe(3);
});

it('Should show a link that directs user to the assignment creation page', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);

    act(() =>{
        render(<AssignmentListComponent/>, container);
    });
    //TODO enter link
    expect(container.getElementsByClassName('new-assignment-btn')).toBe('LINK');
});