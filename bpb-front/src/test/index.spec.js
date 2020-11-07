import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import { act } from 'react-dom/test-utils';
import AssignmentListComponent from '../AssignmentListComponent';
import renderer from 'react-test-renderer';
import { Link } from 'react-router-dom'
import { StaticRouter } from 'react-router'


describe('index.js', () => {
    it('should render AssignmentListComponent', () => {
        const component = renderer.create(
            <StaticRouter location='/' context={{}}>
                <AssignmentListComponent/>
            </StaticRouter>
        )
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

// add additional testing for onclicking nav bar