/*  draw_something_canvas.js - Draw to HTML canvas.
    Copyright 2004-5, 2013 Rhea Myers <rhea@myers.studio>
    Copyright 2023 Myers Studio, Ltd.
  
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

var MersenneTwister = require("./MersenneTwister");
var Drawing = require("./drawing");

var DrawingCanvas = function (canvas, num_points, randseed) {
  this.drawing = new Drawing (
    canvas.width,
    canvas.height,
    num_points,
    new MersenneTwister(randseed)
  );
  this.canvas = canvas;
  this.context = this.canvas.getContext ("2d");
};

DrawingCanvas.prototype.drawPolyline = function (polyline) {
  this.context.beginPath ();
  this.context.moveTo (polyline.points[0].x, polyline.points[0].y);
  for (var i = 1; i < polyline.points.length; i++) {
    this.context.lineTo(polyline.points[i].x, polyline.points[i].y);
  }
};

DrawingCanvas.prototype.fillPolyline = function (polyline, style) {
  this.context.fillStyle = this.drawing.palette.to_css(style);
  this.drawPolyline(polyline);
  this.context.fill();
};

DrawingCanvas.prototype.strokePolyline = function (polyline, style, width) {
  this.context.lineJoin = "round";
  this.context.lineWidth = width;
  this.context.strokeStyle = this.drawing.palette.to_css(style);
  this.drawPolyline(polyline);
  this.context.stroke();
};

DrawingCanvas.prototype.drawSkeleton = function () {
  this.strokePolyline (this.drawing.skeleton, this.drawing.palette.foreground, 1);
};

DrawingCanvas.prototype.drawOutline = function (width) {
  this.strokePolyline (this.drawing.outline, this.drawing.palette.outline, width);
};

DrawingCanvas.prototype.fillOutline = function () {
  this.fillPolyline (this.drawing.outline, this.drawing.palette.foreground);
};

DrawingCanvas.prototype.drawInProgress = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.lineJoin = "round";
  this.context.lineCap = "round";
  this.context.lineWidth = 1;
  this.context.strokeStyle = this.drawing.palette.to_css(
    this.drawing.palette.background
  );
  this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  this.drawSkeleton ();
  this.drawOutline (this.drawing.outline_width);
};

DrawingCanvas.prototype.drawComplete = function() {
  this.context.fillStyle = this.drawing.palette.to_css(
    this.drawing.palette.background
  );
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.fillOutline ();
  this.drawOutline (this.drawing.outline_width);
};

DrawingCanvas.prototype.update = function () {
  var active = false;
  if (! this.drawing.should_finish ()) {
    this.drawing.to_next_point ();
    active = true;
  }
  return active;
};

module.exports = DrawingCanvas;
