/*
 * Square
 */
class Square {
  lowerLeftPrev;
  lowerRightPrev;
  upperRightPrev;
  upperLeftPrev;

  lowerLeft;
  lowerRight;
  upperRight;
  upperLeft;

  velocityX;
  velocityY;

  canCheckForCollisions;

  constructor(lowerLeft, upperRight) {
    let width = Math.abs(upperRight[0] - lowerLeft[0]);
    this.lowerLeft = lowerLeft;
    this.upperRight = upperRight;
    this.lowerRight = vec2(lowerLeft[0] + width, lowerLeft[1]);
    this.upperLeft = vec2(upperRight[0] - width, upperRight[1]);
    this.setPreviousPoints();
    this.velocityX = 0.0;
    this.velocityY = 0.0;
  }

  move() {
    let pts = [
      this.lowerLeft,
      this.lowerRight,
      this.upperLeft,
      this.upperRight,
    ];
    pts = pts.map((pt) => [pt[0] + this.velocityX, pt[1] + this.velocityY]);
    this.setPoints(pts[0], pts[1], pts[2], pts[3]);
  }

  getPoints() {
    return [this.lowerLeft, this.lowerRight, this.upperLeft, this.upperRight];
  }

  getPointsForTRIANGLE_STRIP() {
    return [this.lowerLeft, this.lowerRight, this.upperLeft, this.upperRight];
  }

  getPointsForTRIANGLES() {
    return [
      this.lowerLeft,
      this.lowerRight,
      this.upperLeft,
      this.lowerRight,
      this.upperRight,
      this.upperLeft,
    ];
  }

  getVelocityX() {
    return this.velocityX;
  }

  getVelocityY() {
    return this.velocityY;
  }

  setVelocityX(velocityX) {
    this.velocityX = velocityX;
  }

  setVelocityY(velocityY) {
    this.velocityY = velocityY;
  }

  setRandomStartingVelocity(min, max) {
    let vec = this.getRandomDirectionVector(min, max);
    this.velocityX = vec[0];
    this.velocityY = vec[1];
  }

  checkCollisions(otherLines) {
    for (const otherLine of otherLines) {
      let didCollide = this.checkCollision(otherLine);
      if (didCollide) return;
    }
  }

  checkCollision(otherLine) {
    let isColliding = this.didCollideWithLine(otherLine);
    if (isColliding) {
      if (otherLine.isVertical()) {
        this.velocityX = -this.velocityX;
      } else if (otherLine.isHorizontal()) {
        this.velocityY = -this.velocityY;
      }

      this.setPoints(
        this.lowerLeftPrev,
        this.lowerRightPrev,
        this.upperRightPrev,
        this.upperLeftPrev
      );
    }
    return isColliding;
  }

  // returns true if this square did collide with the other line entity
  didCollideWithLine(other) {
    let vertexPath1 = new Line(this.lowerLeftPrev, this.lowerLeft);
    let vertexPath2 = new Line(this.lowerRightPrev, this.lowerRight);
    let vertexPath3 = new Line(this.upperRightPrev, this.upperRight);
    let vertexPath4 = new Line(this.upperLeftPrev, this.upperLeft);

    let check1 = vertexPath1.isIntersectingWith(other);
    let check2 = vertexPath2.isIntersectingWith(other);
    let check3 = vertexPath3.isIntersectingWith(other);
    let check4 = vertexPath4.isIntersectingWith(other);

    return check1 || check2 || check3 || check4;
  }

  setPoints(pt1, pt2, pt3, pt4) {
    this.setPreviousPoints();
    this.lowerLeft = pt1;
    this.lowerRight = pt2;
    this.upperRight = pt3;
    this.upperLeft = pt4;
  }

  setPreviousPoints() {
    this.lowerLeftPrev = this.lowerLeft;
    this.lowerRightPrev = this.upperRight;
    this.upperRightPrev = this.lowerRight;
    this.upperLeftPrev = this.upperLeft;
  }

  /*
   * Returns a random vector between some min and max
   */
  getRandomDirectionVector(minSpeed, maxSpeed) {
    var random_boolean1 = Math.random() < 0.5;
    var random_boolean2 = Math.random() < 0.5;
    var speed = maxSpeed / 1000;
    var rand1 = this.randomIntFromInterval(minSpeed, maxSpeed) / maxSpeed;
    var rand2 = this.randomIntFromInterval(minSpeed, maxSpeed) / maxSpeed;
    rand1 *= random_boolean1 ? 1 : -1;
    rand2 *= random_boolean2 ? 1 : -1;
    var directionX = rand1 * speed;
    var directionY = rand2 * speed;

    return vec2(directionX, directionY);
  }

  /*
   * Rand Between
   */
  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
