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

  constructor(lowerLeft, upperRight) {
    let width = Math.abs(upperRight[0] - lowerLeft[0]);
    this.lowerLeft = lowerLeft;
    this.upperRight = upperRight;
    this.lowerRight = vec2(lowerLeft[0] + width, lowerLeft[1]);
    this.upperLeft = vec2(upperRight[0] - width, upperRight[1]);
    this.setPreviousPoints();
  }

  getPoints() {
    return [this.lowerLeft, this.lowerRight, this.upperLeft, this.upperRight];
  }

  move(deltaX, deltaY) {
    let pts = this.getPoints();
    pts = pts.map((pt) => [pt[0] + deltaX, pt[1] + deltaY]);
    this.setPoints(pts[0], pts[1], pts[2], pts[3]);
  }

  getLeftBound() {
    return this.lowerLeft[0];
  }

  getRightBound() {
    return this.upperRight[0];
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

    // console.log(check1);
    // console.log(check2);
    // console.log(check3);
    // console.log(check4);

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
}
