/*  drawing_artblocks.js - Draw from Artblocks seed.
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
var DrawingCanvas = require("./drawing_canvas");

const hexToInts = (hex) => {
  var numValues = Math.floor(hex.length / 2.0);
  var ints = new Uint32Array(numValues);
  for (var c = 0; c < hex.length; c += 2) {
    ints[Math.floor(c / 2)] = parseInt(hex.substr(c, 2), 16);
  }
  return ints;
};

class DrawingArtblocks extends DrawingCanvas {
  constructor (canvas, num_points, seed) {
    // This is wasteful, refactor.
    super(canvas, num_points, seed);
    const rng = new MersenneTwister();
    
    rng.seedArray(hexToInts(seed));

    this.drawing = new Drawing (
      canvas.width,
      canvas.height,
      num_points,
      rng
    );

    // Copypasta
    this.canvas = canvas;
    this.context = this.canvas.getContext ("2d");
  }
};

module.exports = DrawingArtblocks;
