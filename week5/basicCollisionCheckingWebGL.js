"use strict";

/*
 * Global variables
 */
let gl;

let vertices = [];
let deltaX = 0.0;
let deltaXLoc;
let deltaY = 0.0;
let deltaYLoc;

let theta = 0.0;
let thetaLoc;

let delay = 2;
let direction = true;

let square1;
let wallLower = new Line(vec2(-1, -1), vec2(1, -1));
let wallRight = new Line(vec2(1, -1), vec2(1, 1));
let wallUpper = new Line(vec2(1, 1), vec2(-1, 1));
let wallLeft = new Line(vec2(-1, 1), vec2(-1, -1));
let walls = [wallUpper, wallLower, wallLeft, wallRight];

/*
 * Main Driver Code
 */
window.onload = function init() {
  let canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers
  let program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  square1 = new Square(vec2(-0.1, -0.1), vec2(0.1, 0.1));
  square1.setRandomStartingVelocity(5, 10);
  vertices = square1.getPointsForTRIANGLE_STRIP();

  // Load the data into the GPU
  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  let vPosition = gl.getAttribLocation(program, "vPosition");

  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  deltaXLoc = gl.getUniformLocation(program, "deltaX");
  deltaYLoc = gl.getUniformLocation(program, "deltaY");
  thetaLoc = gl.getUniformLocation(program, "theta");

  render();
};

/*
 * Render
 */
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  theta = 0;
  deltaX += square1.getVelocityX();
  deltaY += square1.getVelocityY();

  square1.move();
  square1.checkCollisions(walls);

  gl.uniform1f(deltaXLoc, deltaX);
  gl.uniform1f(deltaYLoc, deltaY);
  gl.uniform1f(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);

  setTimeout(function () {
    requestAnimFrame(render);
  }, delay);
}
