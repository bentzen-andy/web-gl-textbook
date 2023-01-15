let numPoints = 500;
window.onload = init;

function init() {
  const { canvas, gl } = getCanvasContext("gl-canvas");
  const points = getGasketPoints();
  sendPointsToWebGl(canvas, gl, points);
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
// Gasket Builder
//
function getGasketPoints() {
  //
  //  Initialize our data for the Sierpinski Gasket
  //
  let vertices = getInitialTriangle();

  // And, add our initial point into our array of points
  let initPoint = getInitialPoint(vertices);
  points = [initPoint];

  // Compute new points
  // Each new point is located midway between
  // last point and a randomly chosen vertex
  let gasketPoints = getRandomGasketPoints(vertices, numPoints, initPoint);
  points = [...points, ...gasketPoints];

  return points;
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
// Gasket Builder - Helper functions
//
function getInitialTriangle() {
  // First, initialize the corners of our gasket with three points.
  let vertices = [vec2(-1, -1), vec2(0, 1), vec2(1, -1)];
  return vertices;
}

function getInitialPoint(vertices) {
  // Specify a starting point p for our iterations
  // p must lie inside any set of three vertices

  let u = add(vertices[0], vertices[1]);
  let v = add(vertices[0], vertices[2]);
  let p = scale(0.25, add(u, v));

  return p;
}

function getRandomGasketPoints(vertices, numPoints, initPoint) {
  let points = [initPoint];
  for (let i = 0; i < numPoints; i++) {
    let j = Math.floor(Math.random() * 3);
    p = add(points[i], vertices[j]);
    p = scale(0.5, p);
    points.push(p);
  }
  return points;
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
  gl.drawArrays(gl.POINTS, 0, points.length);
}
