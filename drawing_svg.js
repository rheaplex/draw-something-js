/*  drawing_svg.js - Draw to SVG.
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

var builder = require('xmlbuilder');

var Drawing = require('./drawing');

var DrawingSVG = function (svg, num_points, randseed) {
  this.svg = svg;
  this.drawing = new Drawing(
    svg.viewBox.baseVal.width,
    svg.viewBox.baseVal.height,
    num_points,
    randseed
  );
  const background = this.svg.getElementById("background");
  background.style.fill = "white";
  background.style.stroke = this.drawing.palette.to_css(
    this.drawing.palette.background
  );
  background.style.strokeWidth = 10;
  const skeleton = this.svg.getElementById("skeleton");
  this.clear_path(skeleton);
  skeleton.style.fill = "none";
  skeleton.style.stroke = this.drawing.palette.to_css(
      this.drawing.palette.foreground
  );
  skeleton.style.strokeWidth = 1;
  const fill = this.svg.getElementById("fill");
  this.clear_path(fill);
  fill.style.fill = this.drawing.palette.to_css(
    this.drawing.palette.foreground
  );
  const outline = this.svg.getElementById("outline");
  this.clear_path(outline);
  outline.style.fill = "none";
  outline.style.stroke = this.drawing.palette.to_css(
    this.drawing.palette.outline
  );
  outline.style.strokeWidth = this.drawing.outline_width;
  outline.style.strokeLinejoin = "round";
  outline.style.strokeLinecap = "round";
};

DrawingSVG.prototype.draw = function () {
  while(! this.drawing.should_finish ()) {
    this.drawing.to_next_point ();
  }
};

module.exports = DrawingSVG;
