// function bidirectional(grid, start, end,sParentMap,eParentMap,sMinHeap,eMinHeap,sProcessed,eProcessed,sDistanceMap,eDistanceMap,sHMap,eHMap,choices,sCurr,eCurr){
//   if(sProcessed.has(eCurr)){
//       console.log("Intersected");
//       eCurr.divReference.classList.add("node-intersection");
//       executeDrawPath(eParentMap,eCurr);
//       executeDrawPath(sParentMap,eCurr);
//       return;
//     }
//
//   if(eProcessed.has(sCurr)){
//       console.log("Intersected");
//       sCurr.divReference.classList.add("node-intersection");
//       executeDrawPath(eParentMap,sCurr);
//       executeDrawPath(sParentMap,sCurr);
//       return;
//     }
//   if(sMinHeap.length || eMinHeap.length){
//     if(sMinHeap.length){
//       sMinHeap.sort((a,b) => (sDistanceMap.get(b) + sHMap.get(b)) - (sDistanceMap.get(a) + sHMap.get(a)));
//       sCurr = sMinHeap.pop();
//       if(sProcessed.has(sCurr)){
//         sCurr.divReference.classList.add("node-backtrack");
//       }
//       if(!sProcessed.has(sCurr)){
//         let div = sCurr.divReference;
//         div.classList.add("node-current");
//         setTimeout(()=> {div.classList.remove("node-current"); div.classList.add("node-check");},1000);
//         sProcessed.add(sCurr);
//         for(let i = 0 ; i < choices.length ; ++i){
//           let row = sCurr.row + choices[i][0];
//           let col = sCurr.col + choices[i][1];
//           if(grid[row] && grid[row][col] && !grid[row][col].isWall && !sProcessed.has(grid[row][col])){
//             let currDistance = sDistanceMap.get(sCurr);
//             let edgeDistance = !grid[row][col].weight ? 1 : grid[row][col].weight;
//             let newDistance = currDistance + edgeDistance;
//             if(newDistance < sDistanceMap.get(grid[row][col])){
//               sDistanceMap.set(grid[row][col], newDistance);
//               sParentMap.set(grid[row][col], sCurr);
//             }
//             sMinHeap.push(grid[row][col]);
//           }
//         }
//       }
//     }
//     if(eMinHeap.length){
//       eMinHeap.sort((a,b) => (eDistanceMap.get(b) + eHMap.get(b)) - (eDistanceMap.get(a) + eHMap.get(a)));
//       eCurr = eMinHeap.pop();
//       if(eProcessed.has(eCurr)){
//         eCurr.divReference.classList.add("node-backtrack");
//       }
//       if(!eProcessed.has(eCurr)){
//         let div = eCurr.divReference;
//         div.classList.add("node-current");
//         setTimeout(()=> {div.classList.remove("node-current"); div.classList.add("node-check");},1000);
//         if(eCurr === start){
//           console.log("Found it from end");
//           return;
//         }
//         eProcessed.add(eCurr);
//         for(let i = 0 ; i < choices.length ; ++i){
//           let row = eCurr.row + choices[i][0];
//           let col = eCurr.col + choices[i][1];
//           if(grid[row] && grid[row][col] && !grid[row][col].isWall && !eProcessed.has(grid[row][col])){
//             let currDistance = eDistanceMap.get(eCurr);
//             let edgeDistance = !grid[row][col].weight ? 1 : grid[row][col].weight;
//             let newDistance = currDistance + edgeDistance;
//             if(newDistance < eDistanceMap.get(grid[row][col])){
//               eDistanceMap.set(grid[row][col], newDistance);
//               eParentMap.set(grid[row][col], eCurr);
//             }
//             eMinHeap.push(grid[row][col]);
//           }
//         }
//       }
//     }
//   setTimeout(bidirectional,10,nodes, startNode, endNode,sParentMap,eParentMap,sMinHeap,eMinHeap,sProcessed,eProcessed,sDistanceMap,eDistanceMap,sHMap,eHMap,choices,sCurr,eCurr)
// }else{
//
//   console.log("WASN't FOUND!");
// }
//
// }

function bidirectional(grid, start, end, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed, forwardHeuristic, backwardHeuristic,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices){

  if(forwardMinHeap.length || backwardMinHeap.length){
    if(checkIntersection(forwardProcessed, backwardCurr, forwardParentMap, backwardParentMap)){ return;}
    if(checkIntersection(backwardProcessed, forwardCurr, backwardParentMap, forwardParentMap)){ return;}
    if(forwardMinHeap.length){
      forwardCurr = doAStar(forwardMinHeap,forwardDistanceMap,forwardHeuristic,forwardProcessed,choices,grid,forwardParentMap);
      console.log(forwardCurr);
    }
    if(backwardMinHeap.length){
      backwardCurr = doAStar(backwardMinHeap,backwardDistanceMap,backwardHeuristic,backwardProcessed,choices,grid,backwardParentMap);
      console.log(backwardCurr);
    }

setTimeout(bidirectional,10,grid, start, end, forwardDistanceMap, backwardDistanceMap, forwardProcessed, backwardProcessed, forwardHeuristic, backwardHeuristic,
forwardParentMap, backwardParentMap, forwardMinHeap, backwardMinHeap, forwardCurr, backwardCurr, choices);
  }else{
    console.log("not found");
    return;
  }
  console.log("finished");
}

function doAStar(minHeap, distanceMap, heursticMap, processed, choices, grid, parentMap){
  minHeap.sort((a,b) => (distanceMap.get(b) + heursticMap.get(b)) - (distanceMap.get(a) + heursticMap.get(a)));
  let curr = minHeap.pop();
  let div = curr.divReference;
  if(processed.has(curr)){
    div.classList.add("node-backtrack");
    return curr;
  }
  div.classList.add("node-current");
  setTimeout(() => {div.classList.remove("node-current"); div.classList.add("node-check")});
  processed.add(curr);
  for(let i = 0 ; i < choices.length ; ++i){
    let row = curr.row + choices[i][0];
    let col = curr.col + choices[i][1];
    if(grid[row] && grid[row][col] && !grid[row][col].isWall && !processed.has(grid[row][col])){
      let edgeDistance = !grid[row][col].weight ? 1 : grid[row][col].weight;
      let newDistance = distanceMap.get(curr) + edgeDistance;
      if(newDistance < distanceMap.get(grid[row][col])){
        parentMap.set(grid[row][col], curr);
        distanceMap.set(grid[row][col], newDistance);
      }
      minHeap.push(grid[row][col]);
    }
  }

  return curr;
}
function checkIntersection(processed, curr, currentParentMap, otherParentMap){
  if(processed.has(curr)){
    console.log("intersection");
    curr.divReference.classList.add("node-intersection");
    executeDrawPath(currentParentMap, curr);
    executeDrawPath(otherParentMap, curr);
    return true;
  }
  return false;
}

function bidirectionalRT(grid, start, end){
  if(!grid || !start || !end){
    console.log("invalid input");
    return;
  }

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
  let forwardCurr = start;
  let backwardCurr = end;
  let choices = [[-1,0],[1,0],[0,-1],[0,1]];
  for(let i = 0 ; i < grid.length ; ++i){
    for(let j = 0 ; j < grid[i].length ; ++j){
      forwardDistanceMap.set(grid[i][j],Infinity);
      backwardDistanceMap.set(grid[i][j],Infinity);
      forwardHeuristic.set(grid[i][j], Math.abs(grid[i][j].row - end.row) + Math.abs(grid[i][j].col - end.col));
      backwardHeuristic.set(grid[i][j], Math.abs(grid[i][j].row - start.row) + Math.abs(grid[i][j].col - start.col));
    }
  }
  forwardDistanceMap.set(forwardCurr,0);
  backwardDistanceMap.set(backwardCurr,0);
  forwardParentMap.set(forwardCurr, null);
  backwardParentMap.set(backwardCurr, null);
  forwardMinHeap.push(forwardCurr);
  backwardMinHeap.push(backwardCurr);

  while(forwardMinHeap.length || backwardMinHeap.length){
    if(checkIntersection(forwardProcessed, backwardCurr, forwardParentMap, backwardParentMap)){ return;}
    if(checkIntersection(backwardProcessed, forwardCurr, backwardParentMap, forwardParentMap)){ return;}
    if(forwardMinHeap.length){
      forwardCurr = doAStarRT(forwardMinHeap,forwardDistanceMap,forwardHeuristic,forwardProcessed,choices,grid,forwardParentMap);
      console.log(forwardCurr);
    }
    if(backwardMinHeap.length){
      backwardCurr = doAStarRT(backwardMinHeap,backwardDistanceMap,backwardHeuristic,backwardProcessed,choices,grid,backwardParentMap);
      console.log(backwardCurr);
    }
  }
  console.log("finished");
}
function doAStarRT(minHeap, distanceMap, heursticMap, processed, choices, grid, parentMap){
  minHeap.sort((a,b) => (distanceMap.get(b) + heursticMap.get(b)) - (distanceMap.get(a) + heursticMap.get(a)));
  let curr = minHeap.pop();
  if(processed.has(curr)){
    return curr;
  }
  curr.divReference.classList.add("node-check-rt");
  processed.add(curr);
  for(let i = 0 ; i < choices.length ; ++i){
    let row = curr.row + choices[i][0];
    let col = curr.col + choices[i][1];
    if(grid[row] && grid[row][col] && !grid[row][col].isWall && !processed.has(grid[row][col])){
      let edgeDistance = !grid[row][col].weight ? 1 : grid[row][col].weight;
      let newDistance = distanceMap.get(curr) + edgeDistance;
      if(newDistance < distanceMap.get(grid[row][col])){
        parentMap.set(grid[row][col], curr);
        distanceMap.set(grid[row][col], newDistance);
      }
      minHeap.push(grid[row][col]);
    }
  }

  return curr;
}
