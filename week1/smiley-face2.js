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
  // pts.push([-3, 5], [-3, 2]);
  circlePoint0Deg = [-2, 4];
  circleCenter = [-3, 4];
  buf = getCirclePoints(circlePoint0Deg, circleCenter, 4);
  pts = [...pts, ...buf];

  // create the second eye for the smiley face
  // pts.push([3, 5], [3, 2]);
  circlePoint0Deg = [4, 4];
  circleCenter = [3, 4];
  buf = getCirclePoints(circlePoint0Deg, circleCenter, 4);
  pts = [...pts, ...buf];

  // create the arc for the smile
  arcPointLeft = [-5, -1];
  arcPointRight = [5, -1];
  arcCenter = [0, 0];
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

/*
 * arcPointRight: 2D point - end point of the arc
 * arcPointLeft: 2D point - end point of the arc (assuming it runs
 *  clockwise from arcPointRight)
 * arcCenter: 2D point
 * levelOfDetail - int - number of subdivision passes to run on the
 *  arc to create points
 */
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

/*
 * circlePoint0Deg: 2D point - point on the circle at 0 deg from the center.
 * circleCenter: 2D point
 * levelOfDetail - int - number of subdivision passes to run on the
 *  circle to create points
 */
function getCirclePoints(circlePoint0Deg, circleCenter, levelOfDetail) {
  let delta = circlePoint0Deg[0] - circleCenter[0];
  let circlePoint270Deg = [circleCenter[0], circleCenter[1] + delta];

  let pts1 = getArcPoints(
    circlePoint0Deg,
    circlePoint270Deg,
    circleCenter,
    levelOfDetail
  );

  let pts2 = pts1.map((pt) => rotate(circleCenter, pt, d2r(90)));
  let pts3 = pts2.map((pt) => rotate(circleCenter, pt, d2r(90)));
  let pts4 = pts3.map((pt) => rotate(circleCenter, pt, d2r(90)));

  let pts = [...pts1, ...pts2, ...pts3, ...pts4];

  return pts;
}

function rotate(origin, point, angle) {
  // Rotate a point counterclockwise by a given angle around a given origin.
  // The angle should be given in radians.

  let [ox, oy] = origin;
  let [px, py] = point;

  let qx = ox + Math.cos(angle) * (px - ox) - Math.sin(angle) * (py - oy);
  let qy = oy + Math.sin(angle) * (px - ox) + Math.cos(angle) * (py - oy);
  return [qx, qy];
}

function d2r(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
