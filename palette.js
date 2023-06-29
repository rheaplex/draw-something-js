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
