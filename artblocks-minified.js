require=function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);throw(f=new Error("Cannot find module '"+i+"'")).code="MODULE_NOT_FOUND",f}c=n[i]={exports:{}},e[i][0].call(c.exports,function(r){return o(e[i][1][r]||r)},c,c.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}({1:[function(require,module,exports){!function(root,factory){"use strict";"object"==typeof exports?module.exports=factory():"function"==typeof define&&define.amd?define(factory):root.MersenneTwister=factory()}(this,function(){
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
"use strict";function MersenneTwister(seed){void 0===seed&&(seed=(new Date).getTime()),this.mt=new Array(N),this.mti=625,this.seed(seed)}var N=624,M=397,instance=(
/**
     * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
     *
     * @since 0.1.0
     * @param {number} seed The seed value.
     */
MersenneTwister.prototype.seed=function(seed){var s;for(this.mt[0]=seed>>>0,this.mti=1;this.mti<N;this.mti++)s=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&s)>>>16)<<16)+1812433253*(65535&s)+this.mti,this.mt[this.mti]>>>=0},
/**
     * Initializes the state vector by using an array key[] of unsigned 32-bit integers of the specified length. If
     * length is smaller than 624, then each array of 32-bit integers gives distinct initial state vector. This is
     * useful if you want a larger seed space than 32-bit word.
     *
     * @since 0.1.0
     * @param {array} vector The seed vector.
     */
MersenneTwister.prototype.seedArray=function(vector){var s,i=1,j=0,k=N>vector.length?N:vector.length;for(this.seed(19650218);0<k;k--)s=this.mt[i-1]^this.mt[i-1]>>>30,this.mt[i]=(this.mt[i]^(1664525*((4294901760&s)>>>16)<<16)+1664525*(65535&s))+vector[j]+j,this.mt[i]>>>=0,j++,N<=++i&&(this.mt[0]=this.mt[623],i=1),j>=vector.length&&(j=0);for(k=623;k;k--)s=this.mt[i-1]^this.mt[i-1]>>>30,this.mt[i]=(this.mt[i]^(1566083941*((4294901760&s)>>>16)<<16)+1566083941*(65535&s))-i,this.mt[i]>>>=0,N<=++i&&(this.mt[0]=this.mt[623],i=1);this.mt[0]=2147483648},
/**
     * Generates a random unsigned 32-bit integer.
     *
     * @since 0.1.0
     * @returns {number}
     */
MersenneTwister.prototype.int=function(){var y,kk,mag01=new Array(0,2567483615);if(this.mti>=N){for(625===this.mti&&this.seed(5489),kk=0;kk<227;kk++)y=2147483648&this.mt[kk]|2147483647&this.mt[kk+1],this.mt[kk]=this.mt[kk+M]^y>>>1^mag01[1&y];for(;kk<623;kk++)y=2147483648&this.mt[kk]|2147483647&this.mt[kk+1],this.mt[kk]=this.mt[kk+(M-N)]^y>>>1^mag01[1&y];y=2147483648&this.mt[623]|2147483647&this.mt[0],this.mt[623]=this.mt[396]^y>>>1^mag01[1&y],this.mti=0}return y=this.mt[this.mti++],(y=(y=(y=(y^=y>>>11)^y<<7&2636928640)^y<<15&4022730752)^y>>>18)>>>0},
/**
     * Generates a random unsigned 31-bit integer.
     *
     * @since 0.1.0
     * @returns {number}
     */
MersenneTwister.prototype.int31=function(){return this.int()>>>1},
/**
     * Generates a random real in the interval [0;1] with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
MersenneTwister.prototype.real=function(){return this.int()*(1/4294967295)},
/**
     * Generates a random real in the interval ]0;1[ with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
MersenneTwister.prototype.realx=function(){return(this.int()+.5)*(1/4294967296)},
/**
     * Generates a random real in the interval [0;1[ with 32-bit resolution.
     *
     * Same as .rnd() method - for consistency with Math.random() interface.
     *
     * @since 0.2.0
     * @returns {number}
     */
MersenneTwister.prototype.random=
/**
     * Generates a random real in the interval [0;1[ with 32-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
MersenneTwister.prototype.rnd=function(){return this.int()*(1/4294967296)},
/**
     * Generates a random real in the interval [0;1[ with 53-bit resolution.
     *
     * @since 0.1.0
     * @returns {number}
     */
MersenneTwister.prototype.rndHiRes=function(){return 1/9007199254740992*(67108864*(this.int()>>>5)+(this.int()>>>6))},new MersenneTwister);
/**
     * Instantiates a new Mersenne Twister.
     *
     * @constructor
     * @alias module:MersenneTwister
     * @since 0.1.0
     * @param {number=} seed The initial seed value.
     */
/**
     * A static version of [rnd]{@link module:MersenneTwister#rnd} on a randomly seeded instance.
     *
     * @static
     * @function random
     * @memberof module:MersenneTwister
     * @returns {number}
     */
return MersenneTwister.random=function(){return instance.rnd()},MersenneTwister})},{}],2:[function(require,module,exports){
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
var MersenneTwister=require("./MersenneTwister"),Polyline=require("./polyline"),Turtle=require("./turtle"),Palette=require("./palette");function Drawing(width,height,num_points,seed){"string"==typeof seed?(this.rng=new MersenneTwister,this.rng.seedArray((hex=>{for(var numValues=Math.floor(hex.length/2),ints=new Uint32Array(numValues),c=0;c<hex.length;c+=2)ints[Math.floor(c/2)]=parseInt(hex.substr(c,2),16);return ints})(seed))):this.rng=new MersenneTwister(seed),this.width=width,this.height=height,this.skeleton=this.make_skeleton(this.width,this.height,num_points),this.pen=this.make_pen(),this.first_point=this.pen.position,this.outline=new Polyline,this.palette=new Palette(this.rng),this.outline_width=1+Math.ceil(7*this.rng.random())}
/*Drawing.prototype.make_skeleton = function (width, height, num_points) {
  // Inset skeleton 2 * the pen distance from the edge to avoid cropping
  var inset = pen_distance * 2;
  var skeleton = new Polyline ();
  skeleton.random_points_in_bounds (this.rng, inset, inset, width - (inset * 2),
    height - (inset * 2), num_points);
  return skeleton;
};*/
Drawing.prototype.make_skeleton=function(width,height,num_points){
// Inset skeleton 2 * the pen distance from the edge to avoid cropping
var skeleton=new Polyline;return skeleton.random_points_in_bounds_sep(this.rng,16,16,width-16,height-32,num_points,
// Really, really, avoid loops.
32),skeleton},Drawing.prototype.make_pen=function(){var top_left=this.skeleton.top_leftmost_point();return top_left.y-=8,new Turtle(top_left,8,1.5,1,1)},Drawing.prototype.should_finish=function(){var point_count=this.outline.points.length,first_point=this.outline.points[0];return 5e3<point_count||4<point_count&&this.pen.position.distance_to_point(first_point)<this.pen.forward_step},Drawing.prototype.next_pen_distance=function(){return this.skeleton.distance_to_point(this.pen.next_point_would_be())},Drawing.prototype.next_pen_too_far=function(){return 1.5*this.rng.random()<8-this.next_pen_distance(this.skeleton)},Drawing.prototype.next_pen_too_close=function(){return 1.5*this.rng.random()<this.next_pen_distance(this.skeleton)-8},Drawing.prototype.ensure_next_pen_far_enough=function(){for(;this.next_pen_too_close(this.skeleton);)this.pen.left()},Drawing.prototype.ensure_next_pen_close_enough=function(){for(;this.next_pen_too_far(this.skeleton);)this.pen.right()},Drawing.prototype.adjust_next_pen=function(){this.ensure_next_pen_far_enough(),this.ensure_next_pen_close_enough()},Drawing.prototype.to_next_point=function(){return this.adjust_next_pen(),this.pen.forward(),this.outline.append(this.pen.position),this.point_count++,this.pen.position},module.exports=Drawing},{"./MersenneTwister":1,"./palette":4,"./polyline":6,"./turtle":7}],3:[function(require,module,exports){
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
require("./MersenneTwister");function DrawingSVG(svg,num_points,randseed){this.svg=svg,this.drawing=new Drawing(svg.viewBox.baseVal.width,svg.viewBox.baseVal.height,num_points,randseed),(svg=this.svg.getElementById("background")).style.fill="white",svg.style.stroke=this.drawing.palette.to_css(this.drawing.palette.background),svg.style.strokeWidth=10,num_points=this.svg.getElementById("skeleton"),this.clear_path(num_points),num_points.style.fill="none",num_points.style.stroke=this.drawing.palette.to_css(this.drawing.palette.foreground),num_points.style.strokeWidth=1,randseed=this.svg.getElementById("fill"),this.clear_path(randseed),randseed.style.fill=this.drawing.palette.to_css(this.drawing.palette.foreground),svg=this.svg.getElementById("outline"),this.clear_path(svg),svg.style.fill="none",svg.style.stroke=this.drawing.palette.to_css(this.drawing.palette.outline),svg.style.strokeWidth=this.drawing.outline_width,svg.style.strokeLinejoin="round",svg.style.strokeLinecap="round"}var Drawing=require("./drawing");DrawingSVG.prototype.update=function(){var active=!1;return this.drawing.should_finish()||(this.drawing.to_next_point(),active=!0),active},DrawingSVG.prototype.drawSkeleton=function(){this.svg.getElementById("skeleton").setAttributeNS(null,"d",this.polyline_to_path(this.drawing.skeleton))},DrawingSVG.prototype.drawOutline=function(){this.svg.getElementById("outline").setAttributeNS(null,"d",this.polyline_to_path(this.drawing.outline))},DrawingSVG.prototype.drawFill=function(){this.svg.getElementById("fill").setAttributeNS(null,"d",this.polyline_to_path(this.drawing.outline))},DrawingSVG.prototype.drawInProgress=function(){this.drawSkeleton(),this.drawOutline()},DrawingSVG.prototype.drawComplete=function(){var background=this.svg.getElementById("background"),background=(background.style.stroke="none",background.style.strokeWidth="0",background.style.fill=this.drawing.palette.to_css(this.drawing.palette.background),this.svg.getElementById("skeleton"));background.style.stroke="none",background.style.strokeWidth="0",this.drawOutline(),this.drawFill()},DrawingSVG.prototype.polyline_to_path=function(polyline){for(var d=" M "+polyline.points[0].x.toFixed(3)+" "+polyline.points[0].y.toFixed(3),i=1;i<polyline.points.length;i++)d+=" L "+polyline.points[i].x.toFixed(3)+" "+polyline.points[i].y.toFixed(3);return d},DrawingSVG.prototype.clear_path=function(element){element.setAttributeNS(null,"d","")},module.exports=DrawingSVG},{"./MersenneTwister":1,"./drawing":2}],4:[function(require,module,exports){function Palette(rng){this.background=this.make_colour(rng),this.foreground=this.make_colour(rng),this.outline=this.make_colour(rng)}Palette.prototype.random_percentage=function(rng){return Math.round(100*rng.random())},Palette.prototype.random_angle=function(rng){return Math.floor(360*rng.random())},Palette.prototype.make_colour=function(rng){return{h:this.random_angle(rng),s:this.random_percentage(rng),l:this.random_percentage(rng)}},Palette.prototype.to_css=function(colour){return`hsl(${colour.h}deg ${colour.s}% ${colour.l}%)`},module.exports=Palette},{}],5:[function(require,module,exports){function Point(x,y){this.x=x,this.y=y}Point.prototype.distance_to_point=function(p){return Math.sqrt(Math.pow(p.x-this.x,2)+Math.pow(p.y-this.y,2))},module.exports=Point},{}],6:[function(require,module,exports){function Polyline(){this.points=[]}
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
var Point=require("./point");Polyline.prototype.append=function(p){
// Push is slllllllllow
this.points.push(p)},Polyline.prototype.random_point_in_bounds=function(rng,x,y,width,height){width=rng.random()*width,rng=rng.random()*height;return new Point(x+width,y+rng)},Polyline.prototype.random_points_in_bounds=function(rng,x,y,width,height,count){for(var i=0;i<count;i++){var p=this.random_point_in_bounds(rng,x,y,width,height);this.append(p)}},
// http://www.gamasutra.com/features/20000210/lander_l3.htm
Polyline.prototype.nearest_point_on_line=function(a,b,c){
// SEE IF a IS THE NEAREST POINT - ANGLE IS OBTUSE
var nearest_x,dot_ta=(c.x-a.x)*(b.x-a.x)+(c.y-a.y)*(b.y-a.y);return dot_ta<=0?new Point(a.x,a.y):
// SEE IF b IS THE NEAREST POINT - ANGLE IS OBTUSE
(c=(c.x-b.x)*(a.x-b.x)+(c.y-b.y)*(a.y-b.y))<=0?new Point(b.x,b.y):(nearest_x=a.x+(b.x-a.x)*dot_ta/(dot_ta+c),b=a.y+(b.y-a.y)*dot_ta/(dot_ta+c),new Point(nearest_x,b))},Polyline.prototype.distance_from_line_to_point=function(a,b,c){return this.nearest_point_on_line(a,b,c).distance_to_point(c)},Polyline.prototype.distance_to_point=function(p){for(var distance_to_poly=Number.MAX_VALUE,i=1;i<this.points.length;i++){var a=this.points[i-1],b=this.points[i],a=this.distance_from_line_to_point(a,b,p);a<distance_to_poly&&(distance_to_poly=a)}return distance_to_poly},
// Generate random points that will not result in the polyline having
// any points too close to its lines.
// This is to avoid the pen getting trapped by small gaps between points
// or between points and lines.
Polyline.prototype.random_points_in_bounds_sep=function(rng,x,y,width,height,count,sep){if(count<2)throw new Error("We must generate at least 2 points!");var genp=()=>this.random_point_in_bounds(rng,x,y,width,height);
// We need at least one line to test distances from.
for(this.append(genp()),this.append(genp());this.points.length<count;){var p=genp(),dist=this.distance_to_point(p);
// Is this point to close to any existing lines?
if(!(dist<sep)){
// Are any existing points too close to the new line segment
// that would be formed by adding the new point?
let ok=!0;var q=this.points[this.points.length-1];for(let i=0;i<this.points.length-1;i++)if(this.distance_from_line_to_point(q,p,this.points[i])<sep){ok=!1;break}ok&&this.append(p)}}},Polyline.prototype.top_leftmost_point=function(){for(var top_leftmost=this.points[0],i=1;i<this.points.length;i++)(this.points[i].y<=top_leftmost.y||this.points[i].y==top_leftmost.y&&this.points[i].x<top_leftmost.x)&&(top_leftmost=this.points[i]);return new Point(top_leftmost.x,top_leftmost.y)},module.exports=Polyline},{"./point":5}],7:[function(require,module,exports){function Turtle(position,forward_step,turn_step){this.direction=90,this.position=position,this.forward_step=forward_step,this.turn_step=turn_step}
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
var Point=require("./point"),DEGREES_TO_RADIANS=2*Math.PI/360;Turtle.prototype.left=function(){this.direction-=this.turn_step},Turtle.prototype.right=function(){this.direction+=this.turn_step},Turtle.prototype.forward=function(){this.position=this.next_point_would_be()},Turtle.prototype.next_point_would_be=function(){var x=this.position.x+this.forward_step*Math.sin(this.direction*DEGREES_TO_RADIANS),y=this.position.y+this.forward_step*Math.cos(this.direction*DEGREES_TO_RADIANS);return new Point(x,y)},module.exports=Turtle},{"./point":5}],artblocks:[function(require,module,exports){
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
const DrawingSVG=require("./drawing_svg"),WIDTH=1920,HEIGHT=1080;let svg,drawing;function draw(){drawing.update()?(drawing.drawInProgress(),requestAnimationFrame(draw)):drawing.drawComplete()}document.addEventListener("DOMContentLoaded",function init(){!function createSVGElement(){var existingSvg=document.getElementById("svg");null!=existingSvg&&document.body.remove(existingSvg),(svg=document.createElementNS("http://www.w3.org/2000/svg","svg")).id="svg",svg.setAttribute("viewBox",`0 0 ${WIDTH} `+HEIGHT),(existingSvg=svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))).id="background",existingSvg.style.fill="white",existingSvg.setAttribute("width",WIDTH),existingSvg.setAttribute("height",HEIGHT),svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path")).id="skeleton",svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path")).id="fill",svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path")).id="outline",document.body.appendChild(svg)}(),drawing=new DrawingSVG(svg,12,tokenData.hash),requestAnimationFrame(draw)})},{"./drawing_svg":3}]},{},["artblocks"]);
