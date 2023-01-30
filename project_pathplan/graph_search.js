/*|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\
|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/|
||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/
/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\

    2D Path Planning in HTML5 Canvas | Graph Search Methods

    Stencil methods for student implementation of graph search algorithms.

    @author ohseejay / https://github.com/ohseejay
                     / https://bitbucket.org/ohseejay

    Chad Jenkins
    Laboratory for Perception RObotics and Grounded REasoning Systems
    University of Michigan

    License: Michigan Honor License

    Usage: see search_canvas.html

|\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/|
||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/
/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\
\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/||\/*/



//ARE ALL OF MY J AND IS MESSED UP? WHATS GOING ON?


function initSearchGraph() {

    // create the search queue
    visit_queue = []; //FOR ANYTHING USING THE HEAP

    // initialize search graph as 2D array over configuration space
    //   of 2D locations with specified spatial resolution
    G = [];
    for (iind=0,xpos=-2;xpos<7;iind++,xpos+=eps) {                  //jind and iind represent canvas coordinates while xpos and ypos are world cords
        G[iind] = [];
        for (jind=0,ypos=-2;ypos<7;jind++,ypos+=eps) {
            G[iind][jind] = {
                i:iind,j:jind, // mapping to graph array
                x:xpos,y:ypos, // mapping to map coordinates
                parent:null, // pointer to parent in graph along motion path
                distance:10000, // distance to start via path through parent
                visited:false, // flag for whether the node has been visited
                priority:null, // visit priority based on fscore
                queued:false // flag for whether the node has been queued for visiting
            };

            // STENCIL: determine whether this graph node should be the start
            //   point for the search

            //should probably be a one or two liner
            //only things we know at this point are i,j and x,y
            //always starts at 0,0? could be wrong.

            if(Math.abs(xpos - q_init[0]) < (eps-0.01)/2){
                if(Math.abs(ypos - q_init[1]) < (eps-0.01)/2){
                    G[iind][jind].distance = 0;
                    minheap_insert(visit_queue, G[iind][jind]); 
                }
            }
        }
    }
}




//world cordinates are (9,9) w/ top left corner = -2,-2, bottom right = 7,7 and start at 0,0
//canvas cordinates are 800,800 w/ top left corner = 0,0, bottom right = 800,800, which means start must be at 177.777, 177.777 ?

function iterateGraphSearch() {

    //testCollision(G[i][j].x,G[i][j].y) //is how you call (in world cords)
    if(visit_queue.length == 0){
        search_iterate = false;
        return "failed";
    }

    cur = minheap_extract(visit_queue);
    G[cur.i][cur.j].visited = true;
    draw_2D_configuration([cur.x, cur.y], "visited");
    search_visited = search_visited + 1;

    if(Math.abs(cur.x - q_goal[0]) < (eps-0.01)/2){
        if(Math.abs(cur.y - q_goal[1]) < (eps-0.01)/2){
            search_iterate = false;
            drawHighlightedPathGraph(cur)
            return "succeeded";
        }
    }

    //does writing to top write thru to G[iind][jind] ? 
    //animation stuff?

    if(G[cur.i+1][cur.j].visited == false){ //check to the right
        if(testCollision([G[cur.i+1][cur.j].x, G[cur.i+1][cur.j].y]) == false){
            //valid entry
            if(G[cur.i+1][cur.j].distance > cur.distance + eps){ //TODO IS EPS CORRECT???
                G[cur.i+1][cur.j].parent = cur;
                G[cur.i+1][cur.j].distance = cur.distance + eps;
                G[cur.i+1][cur.j].priority = G[cur.i+1][cur.j].distance + calculatedistance(G[cur.i+1][cur.j], q_goal);
                G[cur.i+1][cur.j].queued = true; //may need to think about the implications of this.
                minheap_insert(visit_queue, G[cur.i+1][cur.j]);
            }
            draw_2D_configuration([G[cur.i + 1][cur.j].x, G[cur.i + 1][cur.j].y], "queued");
        }
    }
    if(G[cur.i-1][cur.j].visited == false){ //check to the left
        if(testCollision([G[cur.i-1][cur.j].x, G[cur.i-1][cur.j].y]) == false){
            //valid entry
            if(G[cur.i-1][cur.j].distance > cur.distance + eps){ //TODO IS EPS CORRECT???
                G[cur.i-1][cur.j].parent = cur;
                G[cur.i-1][cur.j].distance = cur.distance + eps;
                G[cur.i-1][cur.j].priority = G[cur.i-1][cur.j].distance + calculatedistance(G[cur.i-1][cur.j], q_goal);
                G[cur.i-1][cur.j].queued = true; //may need to think about the implications of this.
                minheap_insert(visit_queue, G[cur.i-1][cur.j]);
            }
            draw_2D_configuration([G[cur.i - 1][cur.j].x, G[cur.i - 1][cur.j].y], "queued");
        }
    }
    if(G[cur.i][cur.j+1].visited == false){ //check down
        if(testCollision([G[cur.i][cur.j+1].x, G[cur.i][cur.j+1].y]) == false){
            //valid entry
            if(G[cur.i][cur.j+1].distance > cur.distance + eps){ //TODO IS EPS CORRECT???
                G[cur.i][cur.j+1].parent = cur;
                G[cur.i][cur.j+1].distance = cur.distance + eps;
                G[cur.i][cur.j+1].priority = G[cur.i][cur.j+1].distance + calculatedistance(G[cur.i][cur.j+1], q_goal);
                G[cur.i][cur.j+1].queued = true; //may need to think about the implications of this.
                minheap_insert(visit_queue, G[cur.i][cur.j+1]);
            }
            draw_2D_configuration([G[cur.i][cur.j+1].x, G[cur.i][cur.j+1].y], "queued");
        }
    }
    if(G[cur.i][cur.j-1].visited == false){ // check up
        if(testCollision([G[cur.i][cur.j-1].x, G[cur.i][cur.j-1].y]) == false){
            //valid entry
            if(G[cur.i][cur.j-1].distance > cur.distance + eps){ //TODO IS EPS CORRECT???
                G[cur.i][cur.j-1].parent = cur;
                G[cur.i][cur.j-1].distance = cur.distance + eps;
                G[cur.i][cur.j-1].priority = G[cur.i][cur.j-1].distance + calculatedistance(G[cur.i][cur.j-1], q_goal);
                G[cur.i][cur.j-1].queued = true; //may need to think about the implications of this.
                minheap_insert(visit_queue, G[cur.i][cur.j-1]);
            }
            draw_2D_configuration([G[cur.i][cur.j-1].x, G[cur.i][cur.j-1].y], "queued");
        }
    }

    // STENCIL: implement a single iteration of a graph search algorithm
    //   for A-star (or DFS, BFS, Greedy Best-First)
    //   An asynch timing mechanism is used instead of a for loop to avoid
    //   blocking and non-responsiveness in the browser.
    //
    //   Return "failed" if the search fails on this iteration.
    //   Return "succeeded" if the search succeeds on this iteration.
    //   Return "iterating" otherwise.
    //
    //   When search is complete ("failed" or "succeeded") set the global variable 
    //   search_iterate to false. 
    //
    //   Provided support functions:
    //
    //   testCollision - returns whether a given configuration is in collision
    //   drawHighlightedPathGraph - draws a path back to the start location
    //   draw_2D_configuration - draws a square at a given location
}

//////////////////////////////////////////////////
/////     MIN HEAP IMPLEMENTATION FUNCTIONS
//////////////////////////////////////////////////

    // STENCIL: implement min heap functions for graph search priority queue.
    //   These functions work use the 'priority' field for elements in graph.

//basically copy paste min heap functions, just make sure comparing priority flag in heapify functions.

function minheap_insert(heap, new_element) {
    heap[heap.length] = new_element;
    heapifybottomup(heap, heap.length - 1); //switch to 2?
    return;
}

function minheap_extract(heap) {
    var root = heap[0]; //might want to return this?
    var last = heap[heap.length-1];
    heap[0] = last;
    heap.length = heap.length - 1;
    heapifytopdown(heap, heap.length, 0);
    return root;
}

function heapifybottomup(arr, i){
    var parent = Math.floor((i-1)/2);
    if(parent >= 0){
        if(arr[i].priority < arr[parent].priority){
            var temp = arr[parent];
            arr[parent] = arr[i];
            arr[i] = temp;
            heapifybottomup(arr, parent);
        }
    }
    return;
}

function heapifytopdown(arr, n ,i){
    var smallest = i;
    var leftchild = (i*2) + 1;
    var rightchild = (i*2) + 2;

    if(leftchild < n && arr[leftchild].priority < arr[smallest].priority){
        smallest = leftchild;
    }
    if(rightchild < n && arr[rightchild].priority < arr[smallest].priority){
        smallest = rightchild;
    }
    if(smallest != i){
        var temp = arr[smallest];
        arr[smallest] = arr[i];
        arr[i] = temp;
        heapifytopdown(arr, n, smallest);
    }
    return;
}

function calculatedistance(a,b){
    return ((a.x - b[0]) ** 2 + (a.y - b[1]) ** 2) ** (1/2);
}

