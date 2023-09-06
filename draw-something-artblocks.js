require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (root, factory) {
  "use strict";

  if (typeof exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    root.MersenneTwister = factory();
  }
}(this, function () {
  /**
     * A standalone, pure JavaScript implementation of the Mersenne Twister pseudo random number generator. Compatible
     * with Node.js, requirejs and browser environments. Packages are available for npm, Jam and Bower.
     *
     * @module MersenneTwister
     * @author Raphael Pigulla <pigulla@four66.com>
     * @license See the attached LICENSE file.
     * @version 0.2.3
     */

  /* The license file for MersenneTwister:
Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

 3. The names of its contributors may not be used to endorse or promote
    products derived from this software without specific prior written
    permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  /*
     * Most comments were stripped from the source. If needed you can still find them in the original C code:
     * http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c
     *
     * The original port to JavaScript, on which this file is based, was done by Sean McCullough. It can be found at:
     * https://gist.github.com/banksean/300494
     */
  "use strict";

  var MAX_INT = 4294967296.0,
    N = 624,
    M = 397,
    UPPER_MASK = 0x80000000,
    LOWER_MASK = 0x7fffffff,
    MATRIX_A = 0x9908b0df;

  /**
     * Instantiates a new Mersenne Twister.
     *
     * @constructor
     * @alias module:MersenneTwister
     * @since 0.1.0
     * @param {number=} seed The initial seed value.
     */
  var MersenneTwister = function (seed) {
    if (typeof seed === "undefined") {
      seed = new Date().getTime();
    }

    this.mt = new Array(N);
    this.mti = N + 1;

    this.seed(seed);
  };

  /**
     * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
     *
     * @since 0.1.0
     * @param {number} seed The seed value.
     */
  MersenneTwister.prototype.seed = function (seed) {
    var s;

    this.mt[0] = seed >>> 0;

    for (this.mti = 1; this.mti < N; this.mti++) {
      s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] =
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  };

  /**
     * Initializes the state vector by using an array key[] of unsigned 32-bit integers of the specified length. If
     * length is smaller than 624, then each array of 32-bit integers gives distinct initial state vector. This is
     * useful if you want a larger seed space than 32-bit word.
     *
     * @since 0.1.0
     * @param {array} vector The seed vector.
     */
  MersenneTwister.prototype.seedArray = function (vector) {
    var i = 1,
      j = 0,
      k = N > vector.length ? N : vector.length,
      s;

    this.seed(19650218);

    for (; k > 0; k--) {
      s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);

      this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) +
                vector[j] + j;
      this.mt[i] >>>= 0;
      i++;
      j++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      if (j >= vector.length) {
        j = 0;
      }
    }

    for (k = N - 1; k; k--) {
      s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
      this.mt[i] =
                (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
      this.mt[i] >>>= 0;
      i++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
    }

    this.mt[0] = 0x80000000;
  };

  /**
     * Generates a random unsigned 32-bit integer.
     *
     * @since 0.1.0
     * @returns {number}
     */
  MersenneTwister.prototype.int = function () {
    var y,
      kk,
      mag01 = new Array(0, MATRIX_A);

    if (this.mti >= N) {
      if (this.mti === N + 1) {
        this.seed(5489);
      }

      for (kk = 0; kk < N - M; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
      }

      for (; kk < N - 1; kk++) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
      }

      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
      this.mti = 0;
    }

    y = this.mt[this.mti++];

    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
  };

  /**
     * Generates a random unsigned 31-bit integer.
     *
     * @since 0.1.0
     * @returns {number}
     */
  MersenneTwister.prototype.int31 = function () {
    return this.int() >>> 1;
  };

  /**
     * Generates a random real in the interval [0;1] with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
  MersenneTwister.prototype.real = function () {
    return this.int() * (1.0 / (MAX_INT - 1));
  };

  /**
     * Generates a random real in the interval ]0;1[ with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
  MersenneTwister.prototype.realx = function () {
    return (this.int() + 0.5) * (1.0 / MAX_INT);
  };

  /**
     * Generates a random real in the interval [0;1[ with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
  MersenneTwister.prototype.rnd = function () {
    return this.int() * (1.0 / MAX_INT);
  };

  /**
     * Generates a random real in the interval [0;1[ with 32-bit resolution.
     *
     * Same as .rnd() method - for consistency with Math.random() interface.
     *
     * @since 0.2.0
     * @returns {number}
     */
  MersenneTwister.prototype.random = MersenneTwister.prototype.rnd;

  /**
     * Generates a random real in the interval [0;1[ with 53-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
  MersenneTwister.prototype.rndHiRes = function () {
    var a = this.int() >>> 5,
      b = this.int() >>> 6;

    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  };

  var instance = new MersenneTwister();

  /**
     * A static version of [rnd]{@link module:MersenneTwister#rnd} on a randomly seeded instance.
     *
     * @static
     * @function random
     * @memberof module:MersenneTwister
     * @returns {number}
     */
  MersenneTwister.random = function () {
    return instance.rnd();
  };

  return MersenneTwister;
}));

},{}],2:[function(require,module,exports){
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

var MersenneTwister = require("./MersenneTwister");
var Polyline = require("./polyline");
var Turtle = require("./turtle");
var Palette = require("./palette");

var max_points_guard = 5000;

var pen_distance = 8.0;
var pen_distance_fuzz = 1.5; 
var pen_forward_step = 1.0;
var pen_turn_step = 1.0;
var min_outline_width = 1;
var max_outline_width = 8;
var range_outline_width = (max_outline_width - min_outline_width);

const hexToInts = (hex) => {
  var numValues = Math.floor(hex.length / 2.0);
  var ints = new Uint32Array(numValues);
  for (var c = 0; c < hex.length; c += 2) {
    ints[Math.floor(c / 2)] = parseInt(hex.substr(c, 2), 16);
  }
  return ints;
};

var Drawing = function (width , height , num_points, seed) {
  if (typeof seed === 'string') {
    this.rng = new MersenneTwister();
    this.rng.seedArray(hexToInts(seed));
  } else {
    this.rng = new MersenneTwister(seed);
  }
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

},{"./MersenneTwister":1,"./palette":4,"./polyline":6,"./turtle":7}],3:[function(require,module,exports){
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

var MersenneTwister = require("./MersenneTwister");
var Drawing = require("./drawing");

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

DrawingSVG.prototype.update = function () {
  var active = false;
  if (! this.drawing.should_finish ()) {
    this.drawing.to_next_point ();
    active = true;
  }
  return active;
};

DrawingSVG.prototype.drawSkeleton = function() {
  const skeleton = this.svg.getElementById("skeleton");
  skeleton.setAttributeNS(
    null,
    'd',
    this.polyline_to_path(this.drawing.skeleton)
  );
};

DrawingSVG.prototype.drawOutline = function() {
  const skeleton = this.svg.getElementById("outline");
  skeleton.setAttributeNS(
    null,
    'd',
    this.polyline_to_path(this.drawing.outline)
  );
};

DrawingSVG.prototype.drawFill = function() {
  const fill = this.svg.getElementById("fill");
  fill.setAttributeNS(
    null,
    'd',
    this.polyline_to_path(this.drawing.outline)
  );

};

DrawingSVG.prototype.drawInProgress = function() {
  this.drawSkeleton();
  this.drawOutline();
};

DrawingSVG.prototype.drawComplete = function() {
  const background = this.svg.getElementById("background");
  background.style.stroke = 'none';
  background.style.strokeWidth = "0";
  background.style.fill = this.drawing.palette.to_css(
    this.drawing.palette.background
  );
  const skeleton = this.svg.getElementById("skeleton");
  skeleton.style.stroke = "none";
  skeleton.style.strokeWidth = "0";
  this.drawOutline();
  this.drawFill();
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

DrawingSVG.prototype.clear_path = function (element) {
  element.setAttributeNS(
    null,
    'd',
    ""
  );
};

module.exports = DrawingSVG;

},{"./MersenneTwister":1,"./drawing":2}],4:[function(require,module,exports){
/*  palette.js - A simple colour scheme.
    Copyright (c) 2023 Myers Studio, Ltd.

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

var Palette = function (rng) {
  this.background = this.make_colour(rng);
  this.foreground = this.make_colour(rng);
  this.outline = this.make_colour(rng);
};

Palette.prototype.random_percentage = function (rng) {
  return Math.round(rng.random() * 100);
};

Palette.prototype.random_angle = function (rng) {
  return Math.floor(rng.random() * 360);
};

Palette.prototype.make_colour = function (rng) {
  return {
    h: this.random_angle(rng),
    s: this.random_percentage(rng),
    l: this.random_percentage(rng)
  };
};

Palette.prototype.to_css = function (colour) {
  return `hsl(${colour.h}deg ${colour.s}% ${colour.l}%)`;
};

module.exports = Palette;

},{}],5:[function(require,module,exports){
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
};

Point.prototype.distance_to_point = function (p) {
  return Math.sqrt (Math.pow (p.x - this.x, 2) +
                    Math.pow (p.y - this.y, 2));
};

module.exports = Point;

},{}],6:[function(require,module,exports){
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

},{"./point":5}],7:[function(require,module,exports){
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

var Point = require("./point");

var DEGREES_TO_RADIANS = (Math.PI * 2.0) / 360.0;

var Turtle = function (position, forward_step, turn_step) {
  this.direction = 90.0;
  
  this.position = position;
  this.forward_step = forward_step;
  this.turn_step = turn_step;
};

Turtle.prototype.left = function () {
  this.direction -= this.turn_step;
};

Turtle.prototype.right = function ()
{
  this.direction += this.turn_step;
};

Turtle.prototype.forward = function ()
{
  this.position = this.next_point_would_be ();
};

Turtle.prototype.next_point_would_be = function ()
{
  var x = this.position.x +
    (this.forward_step * Math.sin (this.direction * DEGREES_TO_RADIANS));
  var y = this.position.y +
    (this.forward_step * Math.cos (this.direction * DEGREES_TO_RADIANS));
  return new Point (x, y);
};

module.exports = Turtle;

},{"./point":5}],"artblocks":[function(require,module,exports){
/*  drawing_artblocks.js - Draw to SVG using artblocks hash.
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

const DrawingSVG = require("./drawing_svg");

const WIDTH = 1920;
const HEIGHT = 1080;
const POINT_COUNT = 12;

let svg;
let drawing;

function createSVGElement () {
  let existingSvg = document.getElementById("svg");
  if (existingSvg != null) {
     document.body.remove(existingSvg);
  }
  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "svg";
  svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
  let background = svg.appendChild(document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  ));
  background.id = "background";
  background.style.fill = "white";
  background.setAttribute("width", WIDTH);
  background.setAttribute("height", HEIGHT);
  svg.appendChild(document.createElementNS(
    "http://www.w3.org/2000/svg","path"
  )).id = "skeleton";
  svg.appendChild(document.createElementNS(
    "http://www.w3.org/2000/svg","path"
  )).id = "fill";
    svg.appendChild(document.createElementNS(
    "http://www.w3.org/2000/svg","path"
  )).id = "outline";
  document.body.appendChild(svg);
}

function init () {
  createSVGElement();
  drawing = new DrawingSVG(svg, POINT_COUNT, tokenData.hash);
  requestAnimationFrame(draw);
}

function draw () {
  let still_drawing = drawing.update();
  if (still_drawing) {
    drawing.drawInProgress();
    requestAnimationFrame(draw);
  } else {
    drawing.drawComplete();
  }
}

document.addEventListener('DOMContentLoaded', init);

},{"./drawing_svg":3}]},{},["artblocks"]);
