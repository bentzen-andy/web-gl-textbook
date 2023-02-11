"use strict";

/*
 * Global Variables
 */
var gl;

let vertices = [];
var deltaX = 0.0;
var deltaXLoc;
var deltaY = 0.0;
var deltaYLoc;

var theta = 0.0;
var thetaLoc;

var delay = 2;
var direction = true;

var square1;
var wallLower = new Line(vec2(-1, -1), vec2(1, -1));
var wallRight = new Line(vec2(1, -1), vec2(1, 1));
var wallUpper = new Line(vec2(1, 1), vec2(-1, 1));
var wallLeft = new Line(vec2(-1, 1), vec2(-1, -1));

/*
 * Main Driver Code
 */
window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  square1 = new Square(vec2(-0.1, -0.1), vec2(0.1, 0.1));
  square1.setRandomStartingVelocity(5, 10);
  vertices = square1.getPointsForTRIANGLE_STRIP();

  // Load the data into the GPU
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");

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
  square1.checkCollisions(wallUpper);
  square1.checkCollisions(wallLower);
  square1.checkCollisions(wallLeft);
  square1.checkCollisions(wallRight);

  gl.uniform1f(deltaXLoc, deltaX);
  gl.uniform1f(deltaYLoc, deltaY);
  gl.uniform1f(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);

  setTimeout(function () {
    requestAnimFrame(render);
  }, delay);
}
