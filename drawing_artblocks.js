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
