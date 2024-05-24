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
