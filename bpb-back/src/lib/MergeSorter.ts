export interface ISorter<E> {
    /**
     * @param list a list to be sorted (in place: the sort function sorts the list by adjusting the order of elements directly in that list)
     * @param compareFunction is a function that takes two arguments, x and y. It returns a negative value if x < y, it returns 0 if x =y, and it returns a positive value otherwise.
     */
    sort(list: E[], compareFunction: (x: E, y: E) => number) : void
  }

/**
 * MergeSort Sorter
 */
export default class MergeSorter<E> implements ISorter<E> {
    
    private merge(arrA : E[], arrB : E[], compareFun: (e1: E, e2: E) => number) {
   
        let merged = [];
        let indexA = 0;
        let indexB = 0;
        
        //Add lowest of first index until one list runs out
        while(indexA < arrA.length && indexB < arrB.length) {

            let a = arrA[indexA];
            let b = arrB[indexB];
            let comparison = compareFun(a,b);

            if(comparison < 0) { 
                merged.push(a);
                indexA++;
            } else {
                merged.push(b);
                indexB++;
            }
        }
    
        //If A items remain, add
        if(indexA < arrA.length) {
            while(indexA < arrA.length) {
                merged.push(arrA[indexA]);
                indexA++;
            }
        }
    
        //If B items remain, add
        if(indexB < arrB.length) {
            while(indexB < arrB.length) {
                merged.push(arrB[indexB]);
                indexB++;
            }
        }
        
        return merged;
    }
    
    private mergeSortRec(arr : E[], compareFun: (e1: E, e2: E) => number) : E[] {
        if(arr.length < 2) {
            return arr;
        }
    
        let mid = arr.length / 2;
        let leftArray = this.mergeSortRec(arr.slice(0,mid),compareFun);
        let rightArray = this.mergeSortRec(arr.slice(mid,arr.length),compareFun);
    
        return this.merge(leftArray,rightArray,compareFun);
    }

    public sort(list: E[], compareFun: (e1: E, e2: E) => number) : void {
        let newList = this.mergeSortRec(list,compareFun);
        let index = 0;
        newList.forEach( entry => {
            list[index] = entry;
            index++;
        });
    }
}
