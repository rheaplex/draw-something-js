/*  drawing.js - Drawing around a skeleton with a pen.
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

// Keep these names lowercase as they should be in the object...

var Polyline = require("./polyline");
var Turtle = require("./turtle");
var Palette = require("./palette");
var MersenneTwister = require("./MersenneTwister");

var max_points_guard = 5000;

var pen_distance = 8.0;
var pen_distance_fuzz = 1.5; 
var pen_forward_step = 1.0;
var pen_turn_step = 1.0;
var min_outline_width = 1;
var max_outline_width = 8;
var range_outline_width = (max_outline_width - min_outline_width);

var Drawing = function (width , height , num_points, randseed) {
  this.randseed = randseed;
  this.rng = new MersenneTwister(this.randseed);
  this.width = width;
  this.height = height;
  this.skeleton = this.make_skeleton (this.width, this.height, num_points);
  this.pen = this.make_pen ();
  this.first_point = this.pen.position;
  this.outline = new Polyline();
  this.palette = new Palette(this.rng);
  this.outline_width = min_outline_width
    + Math.ceil(this.rng.random() * range_outline_width);
};

/*Drawing.prototype.make_skeleton = function (width, height, num_points) {
  // Inset skeleton 2 * the pen distance from the edge to avoid cropping
  var inset = pen_distance * 2;
  var skeleton = new Polyline ();
  skeleton.random_points_in_bounds (this.rng, inset, inset, width - (inset * 2),
    height - (inset * 2), num_points);
  return skeleton;
};*/

Drawing.prototype.make_skeleton = function (width, height, num_points) {
  // Inset skeleton 2 * the pen distance from the edge to avoid cropping
  var inset = pen_distance * 2;
  var skeleton = new Polyline ();
  skeleton.random_points_in_bounds_sep (this.rng, inset, inset,
                                        width - (inset * 2, inset),
                                        height - (inset * 2),
                                        num_points,
                                        // Really, really, avoid loops.
                                        inset * 2);
  return skeleton;
};

Drawing.prototype.make_pen = function () {
  var top_left = this.skeleton.top_leftmost_point ();
  top_left.y -= pen_distance;
  var pen = new Turtle (top_left, pen_distance, pen_distance_fuzz,
    pen_forward_step, pen_turn_step);
  return pen;
};

Drawing.prototype.should_finish = function () {
  var point_count = this.outline.points.length;
  var first_point = this.outline.points[0];
  return (point_count > max_points_guard) || 
      ((point_count > 4)
         && (this.pen.position.distance_to_point (first_point)
             < this.pen.forward_step));
};

Drawing.prototype.next_pen_distance = function ()
{
  return this.skeleton.distance_to_point (this.pen.next_point_would_be ());
};

Drawing.prototype.next_pen_too_far = function ()
{
  return (this.rng.random () * pen_distance_fuzz) <
  (pen_distance - this.next_pen_distance (this.skeleton));
};

Drawing.prototype.next_pen_too_close = function ()
{
  return (this.rng.random () * pen_distance_fuzz) <
  (this.next_pen_distance (this.skeleton) - pen_distance);
};

Drawing.prototype.ensure_next_pen_far_enough = function ()
{
  while (this.next_pen_too_close (this.skeleton))
    this.pen.left ();
};

Drawing.prototype.ensure_next_pen_close_enough = function ()
{
  while (this.next_pen_too_far (this.skeleton))
    this.pen.right ();
};

Drawing.prototype.adjust_next_pen = function ()
{
  this.ensure_next_pen_far_enough ();
  this.ensure_next_pen_close_enough ();
};

Drawing.prototype.to_next_point = function ()
{
  this.adjust_next_pen ();
  this.pen.forward ();
  this.outline.append(this.pen.position);
  this.point_count ++;
  return this.pen.position;
};

module.exports = Drawing;
