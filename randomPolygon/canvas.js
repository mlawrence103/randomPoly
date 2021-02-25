var c = document.getElementById("cw");
let width = c.width;
let height = c.height;
var ctx = c.getContext("2d");
let numVert = Math.floor(Math.random() * 5) + 3; //polygon with at least 3 vertices
let xCoords = []; //x coordinates of vertices
let yCoords = []; //y coordinates of vertices

//listen to mouse click for adding vertex at click
c.addEventListener('click',clickPosition,false);

//find the center of mass for randomly generated vertices by taking mean of coordinates
//input xCoordinates = Nx1 array ; yCoordinates = Nx1 array
function findCenter(xCoordinates,yCoordinates){
  let xCent = xCoordinates.reduce((accumulator, currentVal) => {
    return accumulator + currentVal;
  });
  xCent = Math.floor(xCent/xCoordinates.length);
  let yCent = yCoordinates.reduce((accumulator, currentVal) => {
    return accumulator + currentVal;
  });
  yCent = Math.floor(yCent/yCoordinates.length);
  return [xCent,yCent];
}

//convert vertices from cartesian to polar coordinates
//input individual point xCoord = x ; yCoord = y ; center = center of mass of ORIGINAL collection of points
//store original index in array of randomly generated vertices for sorting purposes
function convertToPolar(xCoord, yCoord, center, index){
  const y0 = center[1];
  const x0 = center[0];
  return [Math.sqrt((xCoord-x0)**2+(yCoord-y0)**2),
    Math.atan2((yCoord-y0),(xCoord-x0)), index];
}

//sort function from least to greatest - used for sorting polar angles
function sortFunction(a,b){
  if (a[1] === b[1]) {
    return 0;
  }
  else {
    return (a[1] < b[1]) ? -1 : 1;
  }
}

//calculate distance between two points
//input pointA = [x1,y1] ; pointB = [x2,y2]
function distanceFormula(pointA, pointB){
  let x1 = pointA[0];
  let x2 = pointB[0];
  let y1 = pointA[1];
  let y2 = pointB[1];
  return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}

//find two vertices closest to vertex added by click
//input point = [x,y] ; vertices = N x 2 array of all vertices
function find2ClosestVerts(point, vertices){
  // let polarClick = convertToPolar(point[0],point[1],startPoint,cartesianCoords.length);
  let allDistances = [];
  let minVert1;
  let minVert2;
  //calculate distances to all other vertices
  for (let i = 0; i < vertices.length; i++){
    allDistances.push(distanceFormula(point,vertices[i]));
  }
  console.log(allDistances);
  let minDist1 = Math.min(...allDistances);
  console.log(minDist1);
  let minDist2 = 1000000000;
  //find coordinates for two closest vertices
  for (let i = 0; i < allDistances.length; i++){
    if(allDistances[i]==minDist1){
      minVert1 = [vertices[i][0],vertices[i][1]];
    }
    //second closest distance will be min in allDistances after minDist1 removed
    else if (allDistances[i] < minDist2){
      // console.log(`${allDistances[i]} is less than ${minDist2}`);
      minDist2 = allDistances[i];
      minVert2 = [vertices[i][0],vertices[i][1]];
    }
  }
  ctx.fillStyle = "#000FFF";
  // ctx.fillRect(minVert1[0],minVert1[1],5,5);
  // ctx.fillRect(minVert2[0],minVert2[1],5,5);
  ctx.moveTo(point[0],point[1]);
  ctx.lineTo(minVert1[0],minVert1[1]);
  ctx.moveTo(point[0],point[1]);
  ctx.lineTo(minVert2[0],minVert2[1]);
  ctx.stroke();
  console.log(`min vert 1: ${minVert1} min vert 2: ${minVert2}`);
  orderedCartesian = colorNewPoly(point,minVert1,minVert2,orderedCartesian);
}

//color the new polygon created from added mouse click vertex
//input newVertex = vertex added from mouse click [x1,y1]
//minVert1 = vertex closest to newVertex found in find2ClosestVerts
//minVert 2 = vertex 2nd closest to newVertex found in find2ClosestVerts
//orderedCartesian = all vertices in polygon
function colorNewPoly(newVertex,minVert1,minVert2,orderedCartesian){
  let vert1Idx = 0;
  let vert2Idx = 0;
  let updatedOrderedCartesian = [];
  for (let i = 0; i < orderedCartesian.length; i++){
    if(orderedCartesian[i][0]==minVert1[0] && orderedCartesian[i][1]==minVert1[1]){
      vert1Idx = i;
    }
    else if(orderedCartesian[i][0]==minVert2[0] && orderedCartesian[i][1]==minVert2[1]){
      vert2Idx = i;
    }
  }
  console.log(`New vertex: ${newVertex} minVert1: ${minVert1} at ${vert1Idx} minVert2: ${minVert2} at ${vert2Idx}`);
  let startShape  = 0;
  let endShape = 0
  if(vert1Idx < vert2Idx){
    startShape = vert1Idx;
    endShape = vert2Idx;
  }
  else{
    startShape = vert2Idx;
    endShape = vert1Idx;
  }
  let forward = endShape - startShape;
  let backward = orderedCartesian.length - endShape + startShape;
  // console.log(`forward: ${forward} backward: ${backward}`);
  ctx.beginPath();
  if (forward<=backward){
    console.log('forward');
    for (let i = startShape; i<=endShape; i++){
      ctx.lineTo(orderedCartesian[i][0],orderedCartesian[i][1]);
      // console.log(`${orderedCartesian[i][0]},${orderedCartesian[i][1]}`);
    }
    //update main shape vertices
    for(let i = endShape; i < orderedCartesian.length; i++){
      updatedOrderedCartesian.push([orderedCartesian[i][0],orderedCartesian[i][1]]);
    }
    for(let i = 0; i <= startShape; i++){
      updatedOrderedCartesian.push([orderedCartesian[i][0],orderedCartesian[i][1]]);
      // console.log(`${orderedCartesian[i][0]},${orderedCartesian[i][1]}`);
    }
  }
  else{
    console.log('backward');
    for(let i = endShape; i < orderedCartesian.length; i++){
      ctx.lineTo(orderedCartesian[i][0],orderedCartesian[i][1]);
    }
    for(let i = 0; i <= startShape; i++){
      ctx.lineTo(orderedCartesian[i][0],orderedCartesian[i][1]);
      // console.log(`${orderedCartesian[i][0]},${orderedCartesian[i][1]}`);
    }
    //update main shape vertices
    for (let i = startShape; i<=endShape; i++){
      updatedOrderedCartesian.push([orderedCartesian[i][0],orderedCartesian[i][1]]);
    }
  }
  ctx.lineTo(newVertex[0],newVertex[1]);
  updatedOrderedCartesian.push([newVertex[0],newVertex[1]]);
  ctx.closePath();
  // ctx.lineTo(orderedCartesian[startShape][0],orderedCartesian[startShape][1]);
  console.log('updatedOrderedCartesian: ');
  console.log(updatedOrderedCartesian);
  // ctx.strokeStyle = "green";
  // ctx.lineWidth = 4;
  ctx.fillStyle = "#"+Math.floor(Math.random()*16777215).toString(16);
  ctx.fill();
  ctx.stroke();
  return updatedOrderedCartesian;
}

console.log('Number of vertices: ' + numVert);
ctx.clearRect(0,0,width,height,false);

////////////////////////////////////////////////////////////////
//////////////////////// MAIN FUNCTION ////////////////////////

//generate random vertices in canvas
for (var i = 0; i < numVert; i++){
  let xCoord = Math.floor(Math.random() * width);
  let yCoord = Math.floor(Math.random() * height);
  xCoords.push(xCoord);
  yCoords.push(yCoord);
  // ctx.fillRect(xCoord,yCoord,3,3);
}
console.log('x coordinates: ' + xCoords);
console.log('y coordinates: ' + yCoords);

let startPoint = findCenter(xCoords,yCoords);
console.log('Start Point: ' + startPoint);
ctx.fillStyle = "#FF0000";
// ctx.fillRect(startPoint[0],startPoint[1],3,3);

let polarCoords = []; //convert vertices to polar coordinates (excluding start point)
let cartesianCoords = [];
let orderedCartesian = []; //cartesian vertices ordered using polar conversion

//create 2d array of all vertices in polar coordinates
for (let i = 0; i < xCoords.length; i++){
  polarCoords.push(convertToPolar(xCoords[i],yCoords[i],startPoint,i));
  cartesianCoords.push([xCoords[i],yCoords[i]])
}
cartesianCoords.unshift(startPoint);
console.log('Cartesian Vertices: ');
console.log(cartesianCoords);


console.log(polarCoords);
//sort polar coordinates so can draw closed polygon
polarCoords.sort(sortFunction);

//draw randomly generated polygon
ctx.moveTo(startPoint[0],startPoint[1]);
orderedCartesian.push([startPoint[0],startPoint[1]]);
for (let i = 0; i < xCoords.length; i++){
  ctx.lineTo(xCoords[polarCoords[i][2]], yCoords[polarCoords[i][2]]);
  orderedCartesian.push([xCoords[polarCoords[i][2]], yCoords[polarCoords[i][2]]]);
}
ctx.closePath();
ctx.stroke();

console.log('Ordered Cartesian Vertices: ');
console.log(orderedCartesian);

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

//when user clicks, add vertex at point of click
function clickPosition(e){
  var clickX = e.clientX;
  var clickY = e.clientY;
  ctx.fillStyle = "#000FFF"; //color new vertex blue
  // ctx.fillRect(clickX,clickY,3,3);
  console.log(`Click at [${clickX},${clickY}]`);
  find2ClosestVerts([clickX,clickY],cartesianCoords);
  cartesianCoords.push([clickX,clickY]); //add new vertex to list of all vertices
}
