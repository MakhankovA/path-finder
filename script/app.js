// document.querySelector("#dfs").addEventListener("click",executeDFS);
// document.querySelector("#bfs").addEventListener("click",executeBFS);
// document.querySelector("#dijkstra").addEventListener("click",executeDijkstra);
// document.querySelector("#astar").addEventListener("click",executeAstar);
// document.querySelector("#bidirectional-astar").addEventListener("click",executeBidrectionalAStar);
// document.querySelector("#bidirectional-bfs").addEventListener("click",executeBidrectionalBFS);
// document.querySelector("#bidirectional-greedy-bfs").addEventListener("click",executeBidrectionalGreedyBFS);
// document.querySelector("#greedybest").addEventListener("click",executeGreedyBestFirst);
document.querySelector("#clear-path").addEventListener("click",clearGrid);
document.querySelector("#clear").addEventListener("click",()=>clearGrid(0,false,true));
document.querySelector("#clear-path").addEventListener("click",()=>clearGrid());
document.querySelector("#maze-prim").addEventListener("click",() => generateMazePrimRT(nodes));
document.querySelector("#maze-recursive-backtracker").addEventListener("click",() => recursiveBacktrackerRT(nodes));
document.querySelector("#maze-animation-recursive-backtracker").addEventListener("click",executeRecursiveBacktrackerMazeGeneration);
document.querySelector("#maze-prim-animation").addEventListener("click",executePrimMazeGeneration);
document.querySelector("#visualize").addEventListener("click",visualize);
document.querySelector("#dfs").addEventListener("click",() => makeChoice("DFS"));
document.querySelector("#bfs").addEventListener("click",() => makeChoice("BFS"));
document.querySelector("#dijkstra").addEventListener("click",() => makeChoice("Dijkstra (UCS)"));
document.querySelector("#astar").addEventListener("click",() => makeChoice("A*"));
document.querySelector("#bidirectional-astar").addEventListener("click",() => makeChoice("Bidirectional A*"));
document.querySelector("#bidirectional-bfs").addEventListener("click",() => makeChoice("Bidirectional BFS"));
document.querySelector("#bidirectional-greedy-bfs").addEventListener("click",() => makeChoice("Bidirectional Greedy Best First"));
document.querySelector("#bidirectional-dijkstra").addEventListener("click",() => makeChoice("Bidirectional Dijkstra (UCS)"));
document.querySelector("#greedybest").addEventListener("click",() => makeChoice("Greedy Best First"));
let status = 0;
let running = "";
const height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;
const width = window.innerWdith || document.documentElement.clientWidth ||
document.body.clientWidth;

function visualize(){
  document.querySelector("#visualize").disabled = true;
  document.querySelector("#clear").disabled = true;
  document.querySelector("#clear-path").disabled = true;
  document.querySelector("#size-slider").disabled = true;
  document.querySelector("#breakpoint-toggler").click();
  setTimeout(() => document.querySelector("#grid-helper").scrollIntoView({behaviour:"smooth"}),500);
  // document.querySelector("#grid-helper").scrollIntoView({
  //   behaviour:"smooth"
  // });
  switch(running){
    case "DFS": executeDFS(); break;
    case "BFS": executeBFS(); break;
    case "Dijkstra (UCS)": executeDijkstra(); break;
    case "A*": executeAstar(); break;
    case "Bidirectional A*": executeBidrectionalAStar(); break;
    case "Bidirectional BFS": executeBidrectionalBFS(); break;
    case "Bidirectional Greedy Best First": executeBidrectionalGreedyBFS(); break;
    case "Bidirectional Dijkstra (UCS)" : executeBidrectionalDijkstra(); break;
    case "Greedy Best First": executeGreedyBestFirst(); break;
  }
}
function makeChoice(choice){
  running = choice;
  let btn = document.querySelector("#visualize");
  btn.disabled = false;
  btn.textContent = `Visualize ${choice}`

}
function executePrimMazeGeneration(){
  clearGrid(0,false,false);
  document.querySelector("#breakpoint-toggler").click();
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      nodes[i][j].divReference.classList.add("node-wall");
      nodes[i][j].isWall = true;
    }
  }
  // let choices = [[-1,0],[0,1],[1,0],[0,-1]];
  let choices = [[-2,0],[0,2],[2,0],[0,-2]];
  // picking random cell and making it a passage
  let cell = nodes[Math.floor(Math.random() * nodes.length)][Math.floor(Math.random() * nodes[0].length)];
  cell.isWall = false;
  cell.divReference.classList.remove("node-wall");
  // compute frontier cells of picked random cell
  let frontierList = [];
  computeFrontierCells(nodes,cell,frontierList,choices);
  setTimeout(generateMazePrim,0,nodes,frontierList,choices);
}

function executeRecursiveBacktrackerMazeGeneration(){
  clearGrid(0,false,false);
  document.querySelector("#breakpoint-toggler").click();
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      nodes[i][j].divReference.classList.add("node-wall");
      nodes[i][j].isWall = true;
    }
  }

  let cell = nodes[Math.floor(Math.random() * nodes.length)][Math.floor(Math.random() * nodes[0].length)];
  let s = [];
  cell.isWall = false;
  cell.divReference.classList.remove("node-wall");
  let choices = [[-2,0],[0,2],[2,0],[0,-2]];
  let neighbours = computeFrontierCellsRBT(nodes,cell,choices);
  let rnd = Math.floor(Math.random () * neighbours.length);
  s.push(neighbours[rnd]);
  setTimeout(recursiveBacktracker,0,nodes,s,choices);
}
function executeDFS(){
  if(!nodes || !startNode || !endNode){
    console.log("one of the inputs is empty");
    return;
  }
  clearGrid();
  let s = [];
  let parentMap = new Map();
  s.push(startNode);
  let choices = [[-1,0],[1,0],[0,1],[0,-1]];
  setTimeout(dfs,0,nodes,startNode,endNode,s,parentMap,choices);

}

function executeBFS(){
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input");
    return;
  }
  clearGrid();
  let curr = null;
  let q = [];
  q.push(startNode);
  console.log(q);
  let parentMap = new Map();
  parentMap.set(startNode, null);
  let choices = [[-1,0],[1,0],[0,1],[0,-1]];
  setTimeout(bfs,0,nodes,startNode,endNode,q,parentMap,choices);

}

function executeAstar(){
  if(!nodes || !startNode || !endNode){
    console.log("Invalid input!");
    return;
  }
  clearGrid();
  let parentMap = new Map();
  let distanceMap = new Map();
  let hMap = new Map();
  let processed = new Set();
  let minHeap = [];
  let choices = [[-1,0],[1,0],[0,1],[0,-1]];
  let curr = startNode;
  minHeap.push(curr);
  let h = 0;
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      distanceMap.set(nodes[i][j],Infinity);
      h = Math.abs(nodes[i][j].row - endNode.row) + Math.abs(nodes[i][j].col - endNode.col);
      hMap.set(nodes[i][j],h);
    }
  }
  distanceMap.set(curr, 0);
  parentMap.set(curr, null);
  setTimeout(astar,0,nodes,startNode,endNode,parentMap,distanceMap,hMap,processed,minHeap,choices);
}

function executeDijkstra(){
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input!");
    return;
  }
  clearGrid();
  let curr = startNode;
  let distanceMap = new Map();
  let processed = new Set();
  let choices = [[1,0],[-1,0],[0,-1],[0,1]];
  let parentMap = new Map();
  parentMap.set(curr,null);
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      distanceMap.set(nodes[i][j],Infinity);
    }
  }
  distanceMap.set(curr,0);
  // let minHeap = new MinHeap();
  let minHeap = [];
  // minHeap.insert(curr);
  minHeap.push(curr);
  setTimeout(dijkstra,0,nodes,startNode,endNode,distanceMap,processed,choices,parentMap,minHeap)
}

function executeBidrectionalAStar(){
  // bidirectionalRT(nodes,startNode,endNode);
  // return;
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input!");
    return;
  }
  clearGrid();
  let forwardDistanceMap = new Map();
  let backwardDistanceMap = new Map();
  let forwardProcessed = new Set();
  let backwardProcessed = new Set();
  let forwardHeuristic = new Map();
  let backwardHeuristic = new Map();
  let forwardParentMap = new Map();
  let backwardParentMap = new Map();
  let forwardMinHeap = [];
  let backwardMinHeap = [];
  let forwardCurr = startNode;
  let backwardCurr = endNode;
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      forwardDistanceMap.set(nodes[i][j],Infinity);
      backwardDistanceMap.set(nodes[i][j],Infinity);
      forwardHeuristic.set(nodes[i][j], Math.abs(nodes[i][j].row - endNode.row) + Math.abs(nodes[i][j].col - endNode.col));
      backwardHeuristic.set(nodes[i][j], Math.abs(nodes[i][j].row - startNode.row) + Math.abs(nodes[i][j].col - startNode.col));
    }
  }
  forwardDistanceMap.set(forwardCurr,0);
  backwardDistanceMap.set(backwardCurr,0);
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardMinHeap.push(forwardCurr);
  backwardMinHeap.push(backwardCurr);

  setTimeout(bidirectionalAStar,0,nodes, startNode, endNode, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed, forwardHeuristic, backwardHeuristic,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices);
}

function executeBidrectionalDijkstra(){
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input!");
    return;
  }
  clearGrid();
  let forwardDistanceMap = new Map();
  let backwardDistanceMap = new Map();
  let forwardProcessed = new Set();
  let backwardProcessed = new Set();
  let forwardParentMap = new Map();
  let backwardParentMap = new Map();
  let forwardMinHeap = [];
  let backwardMinHeap = [];
  let forwardCurr = startNode;
  let backwardCurr = endNode;
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
  forwardDistanceMap.set(forwardCurr,0);
  backwardDistanceMap.set(backwardCurr,0);
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardMinHeap.push(forwardCurr);
  backwardMinHeap.push(backwardCurr);

  setTimeout(bidirectionalDijkstra,0,nodes, startNode, endNode, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices);
}
function executeBidrectionalBFS(){
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input!");
    return;
  }
  clearGrid();

  let forwardParentMap = new Map();
  let backwardParentMap = new Map();
  let forwardQueue = [];
  let backwardQueue = [];
  let forwardCurr = startNode;
  let backwardCurr = endNode;
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardQueue.push(forwardCurr);
  backwardQueue.push(backwardCurr);

setTimeout(bidirectionalBFS,0,nodes, startNode, endNode, forwardQueue, backwardQueue, forwardParentMap, backwardParentMap, forwardCurr, backwardCurr, choices);
}

function executeBidrectionalGreedyBFS(){
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input!");
    return;
  }
  clearGrid();
  let forwardParentMap = new Map();
  let backwardParentMap = new Map();
  let forwardMinHeap = [];
  let backwardMinHeap = [];
  let forwardCurr = startNode;
  let backwardCurr = endNode;
  let forwardHeuristic = new Map();
  let backwardHeuristic = new Map();
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      forwardHeuristic.set(nodes[i][j], Math.abs(nodes[i][j].row - endNode.row) + Math.abs(nodes[i][j].col - endNode.col));
      backwardHeuristic.set(nodes[i][j], Math.abs(nodes[i][j].row - startNode.row) + Math.abs(nodes[i][j].col - startNode.col));
    }
  }
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardMinHeap.push(forwardCurr);
  backwardMinHeap.push(backwardCurr);

setTimeout(bidirectionalGreedyBFS,0,nodes, startNode, endNode, forwardMinHeap, backwardMinHeap,forwardParentMap, backwardParentMap, forwardHeuristic, backwardHeuristic, forwardCurr, backwardCurr, choices);
}
function executeGreedyBestFirst(){
  if(!nodes || !startNode || !endNode)
  {
    console.log("Empty input!");
    return;
  }
  clearGrid();
  let heuristicMap = new Map();
  let minHeap = [];
  let parentMap = new Map();
  let curr = startNode;
  let choices = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      heuristicMap.set(nodes[i][j], Math.abs(nodes[i][j].row - endNode.row) + Math.abs(nodes[i][j].col - endNode.col));
    }
  }
  parentMap.set(curr, null);
  minHeap.push(curr);

setTimeout(greedyBest,0,nodes, startNode, endNode, heuristicMap,minHeap,parentMap,choices);
}

function executeDrawPath(parentMap,endNode){
  console.log("Entered here")
  let path = getPath(parentMap,endNode);
  setTimeout(drawPath,0,0,path);
  document.querySelector("#clear").disabled = false;
  document.querySelector("#clear-path").disabled = false;
  document.querySelector("#size-slider").disabled = false;
  let toastTriggerEl = document.getElementById('info-toast')
  let toast = new mdb.Toast(toastTriggerEl)
  toast.show()
}

function clearGrid(statusVal = 0, keep = true, initials=true){
  let failToastTriggerEl = document.getElementById('fail-toast')
  let failToast = new mdb.Toast(failToastTriggerEl)
  let infoToastTriggerEl = document.getElementById('info-toast')
  let infoToast = new mdb.Toast(infoToastTriggerEl)
  let shortcutToastTriggerEl = document.getElementById('shortcut-toast')
  let shortcutToast = new mdb.Toast(shortcutToastTriggerEl)
  failToast.hide()
  infoToast.hide()
  shortcutToast.hide()
  if(!keep){
    grid.addEventListener("click",divClicked);
  }
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      nodes[i][j].divReference.className = "node";
        if(nodes[i][j].isStart){
          if(keep || initials){
            nodes[i][j].divReference.classList.add("node-start");
          }else{
            startNode = null;
            nodes[i][j].isStart = false;
          }
        }
        if(nodes[i][j].isEnd){
          if(keep || initials){
            nodes[i][j].divReference.classList.add("node-end");
          }else{
            endNode = null;
            nodes[i][j].isEnd = false;
          }
        }
        if(nodes[i][j].isWall){
          if(keep){
            nodes[i][j].divReference.classList.add("node-wall");
          }else{
            nodes[i][j].isWall = false;
          }
        }
        if(nodes[i][j].weight){
          if(keep){
            nodes[i][j].divReference.classList.add(`node-strong-${nodes[i][j].weight}`);
          }else{
            nodes[i][j].weight = 0;
          }
        }
      }
    }
  status = statusVal;
}

function chooseRndStartEnd(){
  let rows = nodes.length;
  let cols = nodes[0].length;
  let startRndRow = Math.floor(Math.random() * rows);
  let startRndCol = Math.floor(Math.random() * cols);
  while(nodes[startRndRow][startRndCol].isWall){
    startRndRow = Math.floor(Math.random() * rows);
    startRndCol = Math.floor(Math.random() * cols);
  }
  let endRndRow = Math.floor(Math.random() * rows);
  let endRndCol = Math.floor(Math.random() * cols);
  while(endRndCol === startRndCol || nodes[endRndRow][endRndCol].isWall){
   endRndRow = Math.floor(Math.random() * rows);
   endRndCol = Math.floor(Math.random() * cols);
  }

 nodes[startRndRow][startRndCol].divReference.classList.add("node-start");
 startNode = nodes[startRndRow][startRndCol];
 nodes[startRndRow][startRndCol].isStart = true;
 nodes[endRndRow][endRndCol].divReference.classList.add("node-end");
 endNode = nodes[endRndRow][endRndCol];
 nodes[endRndRow][endRndCol].isEnd = true;
}
