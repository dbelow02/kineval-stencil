/*|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\
|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/|
||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/
/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\

    Heap Sort Stencil | JavaScript support functions

    Quick JavaScript Code-by-Example Tutorial 
     
    @author ohseejay / https://github.com/ohseejay
                     / https://bitbucket.org/ohseejay

    Chad Jenkins
    Laboratory for Perception RObotics and Grounded REasoning Systems
    University of Michigan

    License: Michigan Honor License 

|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/|
||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/
/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\
\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/*/


// create empty object 
minheaper = {};

// define insert function for min binary heap
function minheap_insert(heap, new_element) {
    heap[heap.length] = new_element;
    heapifybottomup(heap, heap.length - 1); //switch to 2?
}

// assign insert function within minheaper object
minheaper.insert = minheap_insert;
/* Note: because the minheap_insert function is an object, we can assign 
      a reference to the function within the minheap object, which can be called
      as minheap.insert
*/

// define extract function for min binary heap
function minheap_extract(heap) {
    root = heap[0]; //might want to return this?
    last = heap[heap.length-1];
    heap[0] = last;
    heap.length = heap.length - 1;
    heapifytopdown(heap, heap.length, 0);
    return root;
}

// assign extract function within minheaper object

minheaper.extract = minheap_extract;


function heapifybottomup(arr, i){
    var parent = Math.floor((i-1)/2);
    if(parent >= 0){
        if(arr[i] < arr[parent]){
            var temp = arr[parent];
            arr[parent] = arr[i];
            arr[i] = temp;
            heapifybottomup(arr, parent);
        }
    }
    return;
}

function heapifytopdown(arr, n ,i){
    smallest = i;
    leftchild = (i*2) + 1;
    rightchild = (i*2) + 2;

    if(leftchild < n && arr[leftchild] < arr[smallest]){
        smallest = leftchild;
    }
    if(rightchild < n && arr[rightchild] < arr[smallest]){
        smallest = rightchild;
    }
    if(smallest != i){
        temp = arr[smallest];
        arr[smallest] = arr[i];
        arr[i] = temp;
        heapifytopdown(arr, n, smallest);
    }
    return;
}



