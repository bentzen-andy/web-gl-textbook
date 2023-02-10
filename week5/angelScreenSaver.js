"use strict";

/*
 * Global Variables
 */
var gl;

var deltaX = 0.0;
var deltaXLoc;
var deltaY = 0.0;
var deltaYLoc;

var theta = 0.0;
var thetaLoc;

var delay = 2;
var direction = true;

var directionVector = getRandomDirectionVector(5, 10);
var directionX = directionVector[0];
var directionY = directionVector[1];

var square1;
var wallLower = new Line(vec2(-1, -1), vec2(1, -1));
var wallRight = new Line(vec2(1, -1), vec2(1, 1));
var wallUpper = new Line(vec2(1, 1), vec2(-1, 1));
var wallLeft = new Line(vec2(-1, 1), vec2(-1, -1));

// console.log("wallLower");
// console.log(wallLower);
// console.log("wallRight");
// console.log(wallRight);
// console.log("wallUpper");
// console.log(wallUpper);
// console.log("wallLeft");
// console.log(wallLeft);

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
  var vertices = square1.getPoints();

  // var square1 = [vec2(1, 1), vec2(-1, 1), vec2(1, -1), vec2(-1, -1)];
  // var vertices = square1;

  // vertices = vertices.map((vector) => scale(0.1, vector));

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

  // console.log("----deltaX");
  // console.log(deltaX);
  // console.log("----vertices");
  // console.log(vertices);

  render();
};

/*
 * Render
 */
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // theta += direction ? 0.01 : -0.01;
  theta = 0;
  // deltaX += direction ? 0.01 : -0.01;
  // deltaY += direction ? 0.01 : -0.01;
  // deltaX += direction ? directionX : -directionX;
  // deltaY += direction ? directionY : -directionY;
  deltaX += directionX;
  deltaY += directionY;

  // console.log("----square1 before");
  // console.log(square1);
  square1.move(directionX, directionY);

  if (square1.didCollideWithLine(wallRight)) directionX = -Math.abs(directionX);
  if (square1.didCollideWithLine(wallLeft)) directionX = Math.abs(directionX);
  if (square1.didCollideWithLine(wallUpper)) directionY = -Math.abs(directionY);
  if (square1.didCollideWithLine(wallLower)) directionY = Math.abs(directionY);

  // console.log("----square1 after");
  // console.log(square1);

  gl.uniform1f(deltaXLoc, deltaX);
  gl.uniform1f(deltaYLoc, deltaY);
  gl.uniform1f(thetaLoc, theta);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  setTimeout(function () {
    requestAnimFrame(render);
  }, delay);
}

/*
 * Returns a random vector between some min and max
 */
function getRandomDirectionVector(minSpeed, maxSpeed) {
  var random_boolean1 = Math.random() < 0.5;
  var random_boolean2 = Math.random() < 0.5;
  var speed = maxSpeed / 1000;
  var rand1 = randomIntFromInterval(minSpeed, maxSpeed) / maxSpeed;
  var rand2 = randomIntFromInterval(minSpeed, maxSpeed) / maxSpeed;
  rand1 *= random_boolean1 ? 1 : -1;
  rand2 *= random_boolean2 ? 1 : -1;
  var directionX = rand1 * speed;
  var directionY = rand2 * speed;

  // console.log("----directionX");
  // console.log(directionX);
  // console.log("----directionY");
  // console.log(directionY);
  // console.log("----sum");
  // console.log(directionX + directionY);

  return vec2(directionX, directionY);
}

/*
 * Rand Between
 */
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getXDirection() {
  // console.log("----deltaX");
  // console.log(deltaX);
}
