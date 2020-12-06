import { expect } from 'chai';
import MergeSorter from '../src/lib/MergeSorter';

//Sortable object class definition (for testing sorters on arrays of sortable objects)
class SortableObject {
    
    private value : number;
    
    constructor(value :number) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    toString() : String {
        return this.value + "";
    }
}

class SorterFactory<E> {
    createSorter(): MergeSorter<E> {
        return new MergeSorter<E>();
    }
}
//Helper function to check SortableObject[] equivalence
//Throws error if SortableObject[]s are not deeply equal
function expectDeeplyEqual(actual : SortableObject[],  expected : SortableObject[]) {
    let it = 0;
    for(let expectedElement of expected) {
        expect(actual[it].getValue()).to.equal(expectedElement.getValue());
        it++;
    }
}

describe("MergeSorter", () => {

    const sorterFactory = new SorterFactory(); 
    const numericSortAscFn = (s1: number, s2: number) : number => { return s1 - s2 };
    const numericSortDescFn = (s1: number, s2: number) : number => { return s2 - s1 };
    const numericSortBadFn = (s1:number,s2:number) : number => { return 1 };
    const stringSortAscFn= (s1: string, s2: string): number => { if(s1 > s2) { return 1; } else if(s2 > s1) { return -1; } else { return 0; }  }; 
    const stringSortDescFn= (s1: string, s2: string): number => { if(s1 > s2) { return -1; } else if(s2 > s1) { return 1; } else { return 0; }  }; 
    const stringSortBadFn = (s1: string, s2: string): number => { return 1  }; 
    const objectSortAscFn = (s1: SortableObject, s2: SortableObject) : number => { if(s1.getValue() > s2.getValue()) { return 1; } else if(s2.getValue() > s1.getValue()){ return -1; } else { return 0} };
    const objectSortDescFn = (s1: SortableObject, s2: SortableObject) : number => { if(s1.getValue() > s2.getValue()) { return -1; } else if(s2.getValue() > s1.getValue()){ return 1; } else { return 0} };
    const objectSortBadFn = (s1: SortableObject, s2: SortableObject) : number => { return 1 };


    it("should correctly sort an empty array",() => {
        let emptyList = [] as any[];

        sorterFactory.createSorter().sort(emptyList,numericSortAscFn);
        expect(emptyList).to.have.ordered.members(emptyList);
        expect(emptyList).to.be.empty;
    });

    it("should correctly sort an implicitly sorted array of numbers of size 1",() => {
        let actualList = [1];
        sorterFactory.createSorter().sort(actualList,numericSortAscFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
        
        sorterFactory.createSorter().sort(actualList,numericSortDescFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
 
        sorterFactory.createSorter().sort(actualList,numericSortBadFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
    });

    it("should correctly sort an implicitly sorted array of strings of size 1",() =>{ {
        let actualList = ["abc"];
        sorterFactory.createSorter().sort(actualList,stringSortAscFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
        
        sorterFactory.createSorter().sort(actualList,stringSortDescFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
        
        sorterFactory.createSorter().sort(actualList,stringSortBadFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
    }});

    it("should correctly sort an implicitly sorted array of objects of size 1",() => {
        let actualList = [new SortableObject(123)];

        sorterFactory.createSorter().sort(actualList,objectSortAscFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
        expect(actualList[0].getValue()).to.equal(123);
 
        sorterFactory.createSorter().sort(actualList,objectSortDescFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
        expect(actualList[0].getValue()).to.equal(123);
        
        sorterFactory.createSorter().sort(actualList,objectSortBadFn);
        expect(actualList).to.be.length(1);
        expect(actualList).to.have.ordered.members(actualList);
        expect(actualList[0].getValue()).to.equal(123);
    });

    it("should correctly sort an unsorted array of numbers of size 2",() => {
        let actualList = [200,1];
        let expectedAscList = [1,200];
        let expectedDescList = [200,1];

        sorterFactory.createSorter().sort(actualList,numericSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,numericSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });

    it("should correctly sort an unsorted array of strings of size 2",() => {
        let actualList = ["BC","AB"];
        let expectedAscList = ["AB","BC"];
        let expectedDescList = ["BC","AB"];

        sorterFactory.createSorter().sort(actualList,stringSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,stringSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });

    it("should correctly sort an unsorted array of objects of size 2",() => {
        let actualList = [new SortableObject(200),new SortableObject(93)];
        let expectedAscList = [new SortableObject(93),new SortableObject(200)];
        let expectedDescList = [new SortableObject(200),new SortableObject(93)];
        
        sorterFactory.createSorter().sort(actualList,objectSortAscFn);
        expectDeeplyEqual(actualList,expectedAscList);
        
        sorterFactory.createSorter().sort(actualList,objectSortDescFn);
        expectDeeplyEqual(actualList,expectedDescList);
    });

    it("should correctly sort an unsorted array of numbers of size 3",() => {
        let actualList = [4, 1, 2];
        let expectedAscList = [1,2,4];
        let expectedDescList = [4,2,1];
        sorterFactory.createSorter().sort(actualList,numericSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,numericSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });

    it("should correctly sort an unsorted array of strings of size 3",() => {
        let actualList = ["ca","ab","bc"];
        let expectedAscList = ["ab","bc","ca"];
        let expectedDescList = ["ca","bc","ab"];
        sorterFactory.createSorter().sort(actualList,stringSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,stringSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });
   
    it("should correctly sort an unsorted array of objects of size 3",() => {
        let actualList = [new SortableObject(10),new SortableObject(93),new SortableObject(1)];
        let expectedAscList = [new SortableObject(1),new SortableObject(10),new SortableObject(93)];
        let expectedDescList = [new SortableObject(93),new SortableObject(10),new SortableObject(1)];
        
        sorterFactory.createSorter().sort(actualList,objectSortAscFn);
        expectDeeplyEqual(actualList,expectedAscList);
        
        sorterFactory.createSorter().sort(actualList,objectSortDescFn);
        expectDeeplyEqual(actualList,expectedDescList);
    });

    it("should correctly sort an partially sorted array of numbers of size 3",() => {
        let actualList = [1,4,2];
        let expectedAscList = [1,2,4];
        let expectedDescList = [4,2,1];
        sorterFactory.createSorter().sort(actualList,numericSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,numericSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });

    it("should correctly sort a partially sorted array of strings of size 3",() => {
        let actualList = ["ab","ca","bc"];
        let expectedAscList = ["ab","bc","ca"];
        let expectedDescList = ["ca","bc","ab"];
        sorterFactory.createSorter().sort(actualList,stringSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,stringSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });
   
    it("should correctly sort a partially sorted array of objects of size 3",() => {
        let actualList = [new SortableObject(1),new SortableObject(93),new SortableObject(10)];
        let expectedAscList = [new SortableObject(1),new SortableObject(10),new SortableObject(93)];
        let expectedDescList = [new SortableObject(93),new SortableObject(10),new SortableObject(1)];
        
        sorterFactory.createSorter().sort(actualList,objectSortAscFn);
        expectDeeplyEqual(actualList,expectedAscList);
        
        sorterFactory.createSorter().sort(actualList,objectSortDescFn);
        expectDeeplyEqual(actualList,expectedDescList);
    });

    it("should correctly sort a partially sorted array of numbers with some identical values",() => {
        let actualList = [1,2,3,9,2,7,8];
        let expectedAscList = [1,2,2,3,7,8,9];
        let expectedDescList = [9,8,7,3,2,2,1];
        sorterFactory.createSorter().sort(actualList,numericSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,numericSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList)
    });

    it("should correctly sort a partially sorted array of strings with some identical values",() => {
        let actualList = ["a","b","c","e","g","e","h","h"];
        let expectedAscList = ["a","b","c","e","e","g","h","h"];
        let expectedDescList = ["h","h","g","e","e","c","b","a"];
        sorterFactory.createSorter().sort(actualList,stringSortAscFn);
        expect(actualList).to.have.ordered.members(expectedAscList);
        sorterFactory.createSorter().sort(actualList,stringSortDescFn);
        expect(actualList).to.have.ordered.members(expectedDescList);
    });

    it("should correctly sort a partially sorted array of objects with some identical values",() => {
        let actualList = [new SortableObject(5),new SortableObject(6),new SortableObject(6),new SortableObject(9),new SortableObject(7),new SortableObject(8),new SortableObject(7)];
        let expectedAscList = [new SortableObject(5),new SortableObject(6),new SortableObject(6),new SortableObject(7),new SortableObject(7),new SortableObject(8),new SortableObject(9)];
        let expectedDescList  = [new SortableObject(9),new SortableObject(8),new SortableObject(7),new SortableObject(7),new SortableObject(6),new SortableObject(6),new SortableObject(5)];
        
        sorterFactory.createSorter().sort(actualList,objectSortAscFn);
        expectDeeplyEqual(actualList,expectedAscList);
        
        sorterFactory.createSorter().sort(actualList,objectSortDescFn);
        expectDeeplyEqual(actualList,expectedDescList);
    });

    it("should correctly sort a previously sorted array of numbers of size 3",() => {
        let actualAscList = [1,2,4];
        let expectedAscList = [1,2,4];
        sorterFactory.createSorter().sort(actualAscList,numericSortAscFn);
        expect(actualAscList).to.have.ordered.members(expectedAscList);

        let actualListDesc = [4,2,1];
        let expectedDescList = [4,2,1];
        sorterFactory.createSorter().sort(actualListDesc,numericSortDescFn);
        expect(actualListDesc).to.have.ordered.members(expectedDescList);
    });

    it("should correctly sort a previously sorted array of strings of size 3",() => {
        let actualAscList = ["ab","bc","ca"];
        let expectedAscList = ["ab","bc","ca"];
        
        sorterFactory.createSorter().sort(actualAscList,stringSortAscFn);
        expect(actualAscList).to.have.ordered.members(expectedAscList);

        let actualDescList = ["ca","bc","ab"];
        let expectedDescList = ["ca","bc","ab"];
        sorterFactory.createSorter().sort(actualDescList,stringSortDescFn);
        expect(actualDescList).to.have.ordered.members(expectedDescList);
    });
   
    it("should correctly sort a previously sorted array of objects of size 3",() => {
        let actualAscList = [new SortableObject(1),new SortableObject(10),new SortableObject(93)];
        let expectedAscList = [new SortableObject(1),new SortableObject(10),new SortableObject(93)];

        let actualDescList = [new SortableObject(93),new SortableObject(10),new SortableObject(1)];
        let expectedDescList = [new SortableObject(93),new SortableObject(10),new SortableObject(1)];
        
        sorterFactory.createSorter().sort(actualAscList,objectSortAscFn);
        expectDeeplyEqual(actualAscList,expectedAscList);
        
        sorterFactory.createSorter().sort(actualDescList,objectSortDescFn);
        expectDeeplyEqual(actualDescList,expectedDescList);
    });
});
