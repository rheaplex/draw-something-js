require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*  drawing.js - Drawing around a skeleton with a pen.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
  
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

var Polyline = require('./polyline');
var Turtle = require('./turtle');

var max_points_guard = 5000;

var pen_distance = 5.0;
var pen_distance_fuzz = 1.5; 
var pen_forward_step = 2.0;
var pen_turn_step = 1.0;

var Drawing = function (width , height , num_points) {
  this.width = width;
  this.height = height;
  this.skeleton = this.make_skeleton (this.width, this.height, num_points);
  this.pen = this.make_pen ();
  this.first_point = this.pen.position;
  this.outline = new Polyline();
}

Drawing.prototype.make_skeleton = function (width, height, num_points) {
  // Inset skeleton 2 * the pen distance from the edge to avoid cropping
  var inset = pen_distance * 2;
  skeleton = new Polyline ();
  skeleton.random_points_in_bounds (inset, inset, width - (inset * 2),
					                height - (inset * 2), num_points);
  return skeleton;
}

Drawing.prototype.make_pen = function () {
  var top_left = this.skeleton.top_leftmost_point ();
  top_left.y -= pen_distance;
  pen = new Turtle (top_left, pen_distance, pen_distance_fuzz,
			        pen_forward_step, pen_turn_step);
  return pen;
}

Drawing.prototype.should_finish = function () {
  var point_count = this.outline.points.length;
  var first_point = this.outline.points[0]
  return (point_count > max_points_guard) || 
	    ((point_count > 4)
         && (this.pen.position.distance_to_point (first_point)
             < this.pen.forward_step));
}

Drawing.prototype.next_pen_distance = function ()
{
  return this.skeleton.distance_to_point (this.pen.next_point_would_be ());
}

Drawing.prototype.next_pen_too_far = function ()
{
  return (Math.random () * pen_distance_fuzz) <
	(pen_distance - this.next_pen_distance (this.skeleton));
}

Drawing.prototype.next_pen_too_close = function ()
{
	return (Math.random () * pen_distance_fuzz) <
	(this.next_pen_distance (this.skeleton) - pen_distance);
}

Drawing.prototype.ensure_next_pen_far_enough = function ()
{
  while (this.next_pen_too_close (this.skeleton))
	this.pen.left ();
}

Drawing.prototype.ensure_next_pen_close_enough = function ()
{
  while (this.next_pen_too_far (this.skeleton))
	this.pen.right ();
}

Drawing.prototype.adjust_next_pen = function ()
{
  this.ensure_next_pen_far_enough ();
  this.ensure_next_pen_close_enough ();
}

Drawing.prototype.to_next_point = function ()
{
  this.adjust_next_pen ();
  this.pen.forward ();
  this.outline.append(this.pen.position);
  this.point_count ++;
  return this.pen.position;
}

module.exports = Drawing;

},{"./polyline":3,"./turtle":4}],2:[function(require,module,exports){
/*  point.js - A 2D point.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
  
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

var Point = function (x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.distance_to_point = function (p) {
  return Math.sqrt (Math.pow (p.x - this.x, 2) +
			        Math.pow (p.y - this.y, 2));
}

module.exports = Point;

},{}],3:[function(require,module,exports){
/*  polyline.js - A polyline.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
  
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

var Point = require('./point');

var Polyline = function () 
{
  this.points = [];
}

Polyline.prototype.append = function (p)
{
  // Push is slllllllllow
  this.points.push (p);
}

Polyline.prototype.random_points_in_bounds = function (x, y, width, height,
                                                       count) {
  for (var i = 0; i < count; i++)
  {
	var x_pos = Math.random () * width;
	var y_pos = Math.random () * height;
	var p = new Point (x + x_pos, y + y_pos);
    this.append(p);
  }
}

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
}

Polyline.prototype.distance_from_line_to_point = function (a, b, c)
{
  var nearest = this.nearest_point_on_line (a, b, c);
  return nearest.distance_to_point (c);
}

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
}

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
}

module.exports = Polyline;

},{"./point":2}],4:[function(require,module,exports){
/*  turtle.js - A classic computer graphics 'turtle'.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
  
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

var Point = require('./point');

var DEGREES_TO_RADIANS = (Math.PI * 2.0) / 360.0;

var Turtle = function (position, forward_step, turn_step) {
  this.direction = 90.0;
  
  this.position = position;
  this.forward_step = forward_step;
  this.turn_step = turn_step;
}

Turtle.prototype.left = function () {
  this.direction -= this.turn_step;
}

Turtle.prototype.right = function ()
{
  this.direction += this.turn_step;
}

Turtle.prototype.forward = function ()
{
  this.position = this.next_point_would_be ();
}

Turtle.prototype.next_point_would_be = function ()
{
  var x = this.position.x +
	  (this.forward_step * Math.sin (this.direction * DEGREES_TO_RADIANS));
  var y = this.position.y +
	  (this.forward_step * Math.cos (this.direction * DEGREES_TO_RADIANS));
  return new Point (x, y);
}

module.exports = Turtle;

},{"./point":2}],"drawing_canvas":[function(require,module,exports){
/*  draw_something_canvas.js - Draw to HTML canvas.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
  
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

var Drawing = require('./drawing');

var DrawingCanvas = function (canvas, num_points) {
  this.drawing = new Drawing (canvas.width, canvas.height, num_points);
  this.canvas = canvas;
  this.context = this.canvas.getContext ("2d");
}

DrawingCanvas.prototype.drawPolyline = function (polyline) {
  this.context.beginPath ();
  this.context.moveTo (polyline.points[0].x, polyline.points[0].y);
  for (var i = 1; i < polyline.points.length; i++) {
    this.context.lineTo(polyline.points[i].x, polyline.points[i].y);
  }
  this.context.stroke ();
}

DrawingCanvas.prototype.drawSkeleton = function () {
  this.drawPolyline (this.drawing.skeleton);
}

DrawingCanvas.prototype.drawOutline = function () {
  this.drawPolyline (this.drawing.outline);
}

DrawingCanvas.prototype.update = function () {
  var active = false;
  if (! this.drawing.should_finish ()) {
    this.drawing.to_next_point ();
    active = true;
  }
  return active;
}

module.exports = DrawingCanvas;

},{"./drawing":1}]},{},["drawing_canvas"]);
