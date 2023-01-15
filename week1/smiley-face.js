// --------------------------------------------
// Driver Code
//
window.onload = main;

function main() {
  const { canvas, gl } = getCanvasContext("gl-canvas");
  const pts = getPoints();
  sendPointsToWebGl(canvas, gl, pts);
}

function getPoints() {
  let pts = [];
  let buf = [];

  // create the first eye for the smiley face
  pts.push([-3, 5], [-3, 2]);

  // create the second eye for the smiley face
  pts.push([3, 5], [3, 2]);

  // create the arc for the smile
  let arcPointLeft = [-5, -1];
  let arcPointRight = [5, -1];
  let arcCenter = [0, 0];
  buf = getArcPoints(arcPointRight, arcPointLeft, arcCenter, 6);
  pts = [...pts, ...buf];

  // scale points fit on unit graph (min and max are -1 and 1)
  pts = pts.map((pt) => vec2([pt[0] / 10, pt[1] / 10]));
  return pts;
}

// --------------------------------------------
// Canvas Config.
//
function getCanvasContext(id) {
  let canvas = document.getElementById(id);

  let gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  return { canvas, gl };
}

// --------------------------------------------
// Web GL
//
function sendPointsToWebGl(canvas, gl, points) {
  //
  //  Configure WebGL
  //
  initWebGl(canvas, gl);

  //  Load shaders and initialize attribute buffers
  let program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Load the data into the GPU
  loadPointsToGpu(gl, points);

  // Associate our shader variables with our data buffer
  associateShaderToDataBuffer(gl, program);

  render(gl, points);
}

// --------------------------------------------
// Web GL - Helper functions
//
function initWebGl(canvas, gl) {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
}

function loadPointsToGpu(gl, points) {
  let bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
}

function associateShaderToDataBuffer(gl, program) {
  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
}

function render(gl, points) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, points.length);
}

// --------------------------------------------
// Math - Helper functions
//
function getArcMidPoint(endpoint1, endpoint2, arcCenter) {
  const A = { x: endpoint1[0], y: endpoint1[1] };
  const B = { x: endpoint2[0], y: endpoint2[1] };
  const C = { x: arcCenter[0], y: arcCenter[1] };

  // get A and B as vectors relative to C
  const vA = { x: A.x - C.x, y: A.y - C.y };
  const vB = { x: B.x - C.x, y: B.y - C.y };

  // angle between A and B
  const angle = Math.atan2(vA.y, vA.x) - Math.atan2(vB.y, vB.x);

  // half of that
  const half = angle / 2;

  // rotate point B by half of the angle
  const s = Math.sin(half);
  const c = Math.cos(half);

  const xnew = vB.x * c - vB.y * s;
  const ynew = vB.x * s + vB.y * c;

  // midpoint is new coords plus C
  const midPoint = { x: xnew + C.x, y: ynew + C.y };

  return [midPoint.x, midPoint.y];
}

function getArcPoints(arcPointRight, arcPointLeft, arcCenter, levelOfDetail) {
  let currArcPoints = [arcPointRight, arcPointLeft];
  let buf = [];

  for (let j = 0; j < levelOfDetail; j++) {
    for (let i = 0; i < currArcPoints.length; i += 2) {
      buf = [...buf, ...subDivideArc(currArcPoints, arcCenter, i)];
    }
    currArcPoints = buf;
    buf = [];
  }
  return currArcPoints;
}

function subDivideArc(currArcPoints, arcCenter, i) {
  let arcPointMid = getArcMidPoint(
    currArcPoints[i],
    currArcPoints[i + 1],
    arcCenter
  );
  let newArcPoints = [
    currArcPoints[i],
    arcPointMid,
    arcPointMid,
    currArcPoints[i + 1],
  ];
  return newArcPoints;
}
