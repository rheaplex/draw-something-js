/*  drawing_svg.js - Draw to SVG.
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

var builder = require("xmlbuilder");
var Drawing = require("./drawing");

var DrawingSVG = function (svg, num_points, rng) {
  this.drawing = new Drawing (
    svg.width,
    svg.height,
    num_points,
    rng
  );
  this.svg = svg;
};

DrawingSVG.prototype.update = function () {
  var done = this.drawing.should_finish ();
  if(! done) {
    this.drawing.to_next_point ();
  }
  return done;
};

DrawingSVG.prototype.drawSkeleton = function() {
  const skeleton = this.svg.getElementById("skeleton");
  skeleton.setAttributeNS(
    null,
    'path',
    this.polyline_to_path(this.drawing.skeleton)
  );
};

DrawingSVG.prototype.drawOutline = function() {
  const skeleton = this.svg.getElementById("outline");
  skeleton.setAttributeNS(
    null,
    'path',
    this.polyline_to_path(this.drawing.outline)
  );
};

DrawingSVG.prototype.drawFill = function() {
  const fill = this.svg.getElementById("fill");
  fill.setAttributeNS(
    null,
    'path',
    this.polyline_to_path(this.drawing.outline)
  );
  fill.setAttribueNS(null, 'style', );
};

DrawingSVG.prototype.drawInProgress = function() {
  const skeleton = this.svg.getElementById("skeleton");
  const outline = this.svg.getElementById("outline");
  outline.setAttributeNS(
    null,
    'path',
    this.polyline_to_path(this.drawing.outline)
  );
};

DrawingSVG.prototype.drawComplete = function() {
  const skeleton = this.svg.getElementById("skeleton");
  const outline = this.svg.getElementById("outline");
  const background = this.svg.getElementById("background");
  this.svg.removeElement(skeleton);
  outline.setAttributeNS(
    null,
    'path',
    this.polyline_to_path(this.drawing.outline)
  );
  background.setAttributeNS(null, 'style', );
};

DrawingSVG.prototype.polyline_to_path = function (polyline) {
  var d = " M " + polyline.points[0].x.toFixed(3) 
      + " " + polyline.points[0].y.toFixed(3);
  for (var i = 1; i < (polyline.points.length); i++) {
    d += " L " + polyline.points[i].x.toFixed(3) 
      + " " + polyline.points[i].y.toFixed(3);
  }
  return d;
};



module.exports = DrawingSVG;
