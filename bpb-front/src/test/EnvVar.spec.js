import React from 'react';
import {render} from 'react-dom';
import { act } from "react-dom/test-utils";
import { expect } from "chai";
import EnvVarTestComponent from '../EnvVarTestComponent'

describe.skip("Environment Variable Tests", () => {
    it ("Should be able to retreive information from environemtn variable", () => {
        const component = document.createElement('div');
        document.body.appendChild(component);

        act(() => {
            render(<EnvVarTestComponent/>, component)
        });
        expect(component.getElementsByTagName('p').item(0).textContent).to.equal("Hello, World!");
    });
    
});