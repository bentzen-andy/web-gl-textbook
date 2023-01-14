// --------------------------------------------
// Driver Code
//
window.onload = main;

function main() {
  const { canvas, gl } = getCanvasContext("gl-canvas");
  const pt1 = vec2(0.0, 0.0);
  const pt2 = vec2(0.5, -0.5);
  drawLine(canvas, gl, pt1, pt2);
}

function drawLine(canvas, gl, pt1, pt2) {
  const pts = [pt1, pt2];
  sendPointsToWebGl(canvas, gl, pts);
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
  console.log("----points.length");
  console.log(points.length);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_STRIP, 0, points.length);
}
