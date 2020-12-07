import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
import NavbarComponent from "../components/NavbarComponent";
import { StaticRouter } from 'react-router'


describe.skip("NavbarComponent tests:", () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

    })


    it('Should display the navbar', () =>{        

        act(() =>{
            render(<StaticRouter location='/' context={{}}><NavbarComponent /></StaticRouter>, container);  
        }); 

        expect(container.getElementsByClassName('navbar').length).toBe(1);
    });

    it('Should display link to Assignments', () =>{        

        act(() =>{
            render(<StaticRouter location='/' context={{}}><NavbarComponent /></StaticRouter>, container);  
        }); 

        expect(container.querySelector('.nav-link').getAttribute("href")).toContain('/')
    });

    it('Should display link to Help', () =>{        

        act(() =>{
            render(<StaticRouter location='/' context={{}}><NavbarComponent /></StaticRouter>, container);  
        }); 

        expect(container.querySelector('#HelpLink').getAttribute("href")).toContain('/Help')
    });
})
