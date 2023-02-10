/*
 * Line
 */
class Line {
  point1;
  point2;

  constructor(pt1, pt2) {
    this.point1 = pt1;
    this.point2 = pt2;
  }

  isIntersectingWith(that) {
    //     console.log("----this.point1");
    //     console.log(this.point1);
    //     console.log("----this.point2");
    //     console.log(this.point2);

    //     console.log("----that.point1");
    //     console.log(that.point1);
    //     console.log("----that.point2");
    //     console.log(that.point2);

    let x1 = this.point1[0];
    let y1 = this.point1[1];
    let x2 = this.point2[0];
    let y2 = this.point2[1];
    let x3 = that.point1[0];
    let y3 = that.point1[1];
    let x4 = that.point2[0];
    let y4 = that.point2[1];

    let intersection = this.intersect(x1, y1, x2, y2, x3, y3, x4, y4);
    // console.log("----intersection");
    // console.log(intersection);
    return intersection;
  }

  // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
  // Determine the intersection point of two line segments
  // Return FALSE if the lines don't intersect
  intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false;
    }

    let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return { x, y };
  }
}
