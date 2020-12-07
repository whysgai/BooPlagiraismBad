import React from 'react';
import AssignmentListComponent from '../components/assignment/AssignmentListComponent';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router'
import HelpComponent from '../components/HelpComponent';


describe.skip('index.js', () => {
    it('should render AssignmentListComponent', () => {
        const component = renderer.create(
            <StaticRouter location='/' context={{}}>
                <AssignmentListComponent assignments={[]}/>
            </StaticRouter>
        )
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('should render HelpComponent', () => {
        const component = renderer.create(
            <StaticRouter location='/HelpComponent' context={{}}>
                <HelpComponent/>
            </StaticRouter>
        )
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});

// add additional testing for onclicking nav bar