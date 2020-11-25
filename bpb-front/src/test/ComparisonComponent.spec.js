import { expect } from 'chai';
import { StaticRouter} from 'react-router';

describe("ComparisonComponent",() => {

    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it("Should render a CloseComparisonViewButton",() => {
        act(() =>{
            render(<StaticRouter><ComparisonComponent/></StaticRouter>, container);
        });

        expect(container.getElementsByClassName("close-comparison-btn").length).to.equal(1);
    });

    it("Should render ChangeComparisonViewButton",() => {
        act(() =>{
            render(<StaticRouter><ComparisonComponent/></StaticRouter>, container);
        });

        expect(container.getElementsByClassName("change-comparison-btn").length).to.equal(1);
    }); 

    it("Should render comparison metadata (submission names and Deckard similarity information)",() => {

    });

    it("Should render two DocumentVisualizationComponents",() => { 
        act(() =>{
            render(<StaticRouter><ComparisonComponent/></StaticRouter>, container);
        });

        expect(container.getElementsByClassName("document-pane").length).to.equal(2);
    }); 

    it("Should render two DirectoryListComponents",() => {
        act(() =>{
            render(<StaticRouter><ComparisonComponent/></StaticRouter>, container);
        });

        expect(container.getElementsByClassName("directory-list").length).to.equal(2);
    });
});

describe("CloseComparisonViewButton",() => {
    it("Should redirect the user to the assignment page",() => {
        act(() =>{
            render(<StaticRouter><ComparisonComponent/></StaticRouter>, container);
        });

        expect(container.getElementsByClassName("close-comparison-view-btn").getAttribute("href")).toBe("/Assignments"); 
    });
});

describe("ChangeComparisonViewButton",() => {
    //Skipped due to issues with testing interactions
    it.skip("Should switch to Document view if in Snippet view when clicked");

    it.skip("Should switch to Snippet view if in Document view when clicked");
});