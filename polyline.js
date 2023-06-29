/*  polyline.js - A polyline.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
    Copyright 2023 Myers Studio Ltd.

    This file is part of draw-something js.

    draw-something js is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.

    draw-something js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var Point = require("./point");

var Polyline = function () 
{
  this.points = [];
};

Polyline.prototype.append = function (p)
{
  // Push is slllllllllow
  this.points.push (p);
};

Polyline.prototype.random_point_in_bounds = function (
  rng, x, y, width, height
) {
    var x_pos = rng.random () * width;
    var y_pos = rng.random () * height;
    return new Point (x + x_pos, y + y_pos);
};

Polyline.prototype.random_points_in_bounds = function (rng, x, y, width,
  height, count) {
  for (var i = 0; i < count; i++)
  {
    var p = this.random_point_in_bounds(rng, x, y, width, height);
    this.append(p);
  }
};

// http://www.gamasutra.com/features/20000210/lander_l3.htm

Polyline.prototype.nearest_point_on_line = function (a, b, c) {
  // SEE IF a IS THE NEAREST POINT - ANGLE IS OBTUSE
  var dot_ta = (c.x - a.x) * (b.x - a.x) + 
    (c.y - a.y) * (b.y - a.y);
  if (dot_ta <= 0) // IT IS OFF THE AVERTEX
  {
    return new Point (a.x , a.y);
  }
  var dot_tb = (c.x - b.x) * (a.x - b.x) + 
    (c.y - b.y) * (a.y - b.y);
  // SEE IF b IS THE NEAREST POINT - ANGLE IS OBTUSE
  if (dot_tb <= 0)
  {
    return new Point (b.x, b.y);
  }
  // FIND THE REAL NEAREST POINT ON THE LINE SEGMENT
  // BASED ON RATIO
  var nearest_x = a.x + ((b.x - a.x) * dot_ta) / 
    (dot_ta + dot_tb);
  var nearest_y = a.y + ((b.y - a.y) * dot_ta) / 
    (dot_ta + dot_tb);
  return new Point (nearest_x, nearest_y);
};

Polyline.prototype.distance_from_line_to_point = function (a, b, c)
{
  var nearest = this.nearest_point_on_line (a, b, c);
  return nearest.distance_to_point (c);
};

Polyline.prototype.distance_to_point = function (p)
{
  var distance_to_poly = Number.MAX_VALUE;
  for (var i = 1; i < this.points.length; i++)
  {
    var a = this.points[i - 1];
    var b = this.points[i];
    var d = this.distance_from_line_to_point (a, b, p);
    if (d < distance_to_poly)
    {
      distance_to_poly = d;
    }
  }
  return distance_to_poly;
};

// Generate random points that will not result in the polyline having
// any points too close to its lines.
// This is to avoid the pen getting trapped by small gaps between points
// or between points and lines.

Polyline.prototype.random_points_in_bounds_sep = function (
  rng, x, y, width, height, count, sep
) {
  if (count < 2) {
    throw new Error('We must generate at least 2 points!');
  }
  let genp = () => this.random_point_in_bounds(rng, x, y, width, height);
  // We need at least one line to test distances from.
  this.append(genp());
  this.append(genp());
  while (this.points.length < count) {
    const p = genp();
    // Is this point to close to any existing lines?
    const dist = this.distance_to_point(p);
    if (dist < sep) {
      continue;
    }
    // Are any existing points too close to the new line segment
    // that would be formed by adding the new point?
    let ok = true;
    const q = this.points[this.points.length - 1];
    for (let i = 0; i < this.points.length - 1; i++) {
      const d = this.distance_from_line_to_point (q, p, this.points[i]);
      if (d < sep) {
        ok = false;
        break;
      }
    }
    if (ok) {
      this.append(p);
    }
  }
};

Polyline.prototype.top_leftmost_point = function ()
{
  var top_leftmost = this.points[0];
  for (var i = 1; i < this.points.length; i++)
  {
    if ((this.points[i].y <= top_leftmost.y) ||
    ((this.points[i].y == top_leftmost.y) &&
     ((this.points[i].x < top_leftmost.x)))) 
    {
      top_leftmost = this.points[i];
    }
  }
  return new Point (top_leftmost.x, top_leftmost.y);
};

module.exports = Polyline;
