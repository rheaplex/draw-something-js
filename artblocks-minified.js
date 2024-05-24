require=function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);throw(f=new Error("Cannot find module '"+i+"'")).code="MODULE_NOT_FOUND",f}c=n[i]={exports:{}},e[i][0].call(c.exports,function(r){return o(e[i][1][r]||r)},c,c.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}({1:[function(require,module,exports){function Drawing(width,height,num_points){this.width=width,this.height=height,this.skeleton=this.make_skeleton(this.width,this.height,num_points),this.pen=this.make_pen(),this.first_point=this.pen.position,this.outline=new Polyline}
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
var Polyline=require("./polyline"),Turtle=require("./turtle");Drawing.prototype.make_skeleton=function(width,height,num_points){return(skeleton=new Polyline).random_points_in_bounds(10,10,width-20,height-20,num_points),skeleton},Drawing.prototype.make_pen=function(){var top_left=this.skeleton.top_leftmost_point();return top_left.y-=5,pen=new Turtle(top_left,5,1.5,2,1)},Drawing.prototype.should_finish=function(){var point_count=this.outline.points.length,first_point=this.outline.points[0];return 5e3<point_count||4<point_count&&this.pen.position.distance_to_point(first_point)<this.pen.forward_step},Drawing.prototype.next_pen_distance=function(){return this.skeleton.distance_to_point(this.pen.next_point_would_be())},Drawing.prototype.next_pen_too_far=function(){return 1.5*Math.random()<5-this.next_pen_distance(this.skeleton)},Drawing.prototype.next_pen_too_close=function(){return 1.5*Math.random()<this.next_pen_distance(this.skeleton)-5},Drawing.prototype.ensure_next_pen_far_enough=function(){for(;this.next_pen_too_close(this.skeleton);)this.pen.left()},Drawing.prototype.ensure_next_pen_close_enough=function(){for(;this.next_pen_too_far(this.skeleton);)this.pen.right()},Drawing.prototype.adjust_next_pen=function(){this.ensure_next_pen_far_enough(),this.ensure_next_pen_close_enough()},Drawing.prototype.to_next_point=function(){return this.adjust_next_pen(),this.pen.forward(),this.outline.append(this.pen.position),this.point_count++,this.pen.position},module.exports=Drawing},{"./polyline":18,"./turtle":19}],2:[function(require,module,exports){
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
require("xmlbuilder");function DrawingSVG(svg,num_points,randseed){this.svg=svg,this.drawing=new Drawing(svg.viewBox.baseVal.width,svg.viewBox.baseVal.height,num_points,randseed),(svg=this.svg.getElementById("background")).style.fill="white",svg.style.stroke=this.drawing.palette.to_css(this.drawing.palette.background),svg.style.strokeWidth=10,num_points=this.svg.getElementById("skeleton"),this.clear_path(num_points),num_points.style.fill="none",num_points.style.stroke=this.drawing.palette.to_css(this.drawing.palette.foreground),num_points.style.strokeWidth=1,randseed=this.svg.getElementById("fill"),this.clear_path(randseed),randseed.style.fill=this.drawing.palette.to_css(this.drawing.palette.foreground),svg=this.svg.getElementById("outline"),this.clear_path(svg),svg.style.fill="none",svg.style.stroke=this.drawing.palette.to_css(this.drawing.palette.outline),svg.style.strokeWidth=this.drawing.outline_width,svg.style.strokeLinejoin="round",svg.style.strokeLinecap="round"}var Drawing=require("./drawing");DrawingSVG.prototype.draw=function(){for(;!this.drawing.should_finish();)this.drawing.to_next_point()},module.exports=DrawingSVG},{"./drawing":1,xmlbuilder:15}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){require("underscore");module.exports=function(){function XMLAttribute(parent,name,value){if(this.stringify=parent.stringify,null==name)throw new Error("Missing attribute name");this.name=this.stringify.attName(name),this.value=this.stringify.attValue(value)}return XMLAttribute.prototype.toString=function(options,level){null!=options&&options.pretty;var indent=(null!=options?options.indent:void 0)||"  ";null!=options&&options.newline;return level=level||0,new Array(level).join(indent)," "+this.name+'="'+this.value+'"'},XMLAttribute}()}.call(this)},{underscore:16}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){require("underscore");var XMLStringifier=require("./XMLStringifier"),XMLDeclaration=require("./XMLDeclaration"),XMLDocType=require("./XMLDocType"),XMLElement=require("./XMLElement");module.exports=function(){function XMLBuilder(name,options){if(null==name)throw new Error("Root element needs a name");this.stringify=new XMLStringifier(options=null==options?{}:options),options.headless||(this.xmldec=new XMLDeclaration(this,options),null!=options.ext&&(this.doctype=new XMLDocType(this,options))),(options=(options=new XMLElement(this,"doc")).element(name)).isRoot=!0,(options.documentObject=this).rootObject=options}return XMLBuilder.prototype.root=function(){return this.rootObject},XMLBuilder.prototype.end=function(options){return toString(options)},XMLBuilder.prototype.toString=function(options){var r="";return null!=this.xmldec&&(r+=this.xmldec.toString(options)),null!=this.doctype&&(r+=this.doctype.toString(options)),r+this.rootObject.toString(options)},XMLBuilder}()}.call(this)},{"./XMLDeclaration":7,"./XMLDocType":8,"./XMLElement":9,"./XMLStringifier":13,underscore:16}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,XMLNode=(require("underscore"),require("./XMLNode"));module.exports=function(_super){var key,child=XMLCData,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLCData(parent,text){if(XMLCData.__super__.constructor.call(this,parent),null==text)throw new Error("Missing CDATA text");this.text=this.stringify.cdata(text)}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLCData.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level+1).join(indent),indent="",pretty&&(indent+=level),indent+="<![CDATA["+this.text+"]]>",pretty&&(indent+=options),indent},XMLCData}()}.call(this)},{"./XMLNode":10,underscore:16}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,XMLNode=(require("underscore"),require("./XMLNode"));module.exports=function(_super){var key,child=XMLComment,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLComment(parent,text){if(XMLComment.__super__.constructor.call(this,parent),null==text)throw new Error("Missing comment text");this.text=this.stringify.comment(text)}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLComment.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level+1).join(indent),indent="",pretty&&(indent+=level),indent+="\x3c!-- "+this.text+" --\x3e",pretty&&(indent+=options),indent},XMLComment}()}.call(this)},{"./XMLNode":10,underscore:16}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,_=require("underscore"),XMLNode=require("./XMLNode");module.exports=function(_super){var key,child=XMLDeclaration,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLDeclaration(parent,options){XMLDeclaration.__super__.constructor.call(this,parent),null!=(options=_.extend({version:"1.0"},options)).version&&(this.version=this.stringify.xmlVersion(options.version)),null!=options.encoding&&(this.encoding=this.stringify.xmlEncoding(options.encoding)),null!=options.standalone&&(this.standalone=this.stringify.xmlStandalone(options.standalone))}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLDeclaration.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level+1).join(indent),indent="",pretty&&(indent+=level),indent+="<?xml",null!=this.version&&(indent+=' version="'+this.version+'"'),null!=this.encoding&&(indent+=' encoding="'+this.encoding+'"'),null!=this.standalone&&(indent+=' standalone="'+this.standalone+'"'),indent+="?>",pretty&&(indent+=options),indent},XMLDeclaration}()}.call(this)},{"./XMLNode":10,underscore:16}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,XMLNode=(require("underscore"),require("./XMLNode"));module.exports=function(_super){var key,child=XMLDocType,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLDocType(parent,options){XMLDocType.__super__.constructor.call(this,parent),null!=options.ext&&(this.ext=this.stringify.xmlExternalSubset(options.ext))}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLDocType.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level+1).join(indent),indent="",pretty&&(indent+=level),indent=(indent+="<!DOCTYPE")+(" "+this.parent.root().name),null!=this.ext&&(indent+=" "+this.ext),indent+=">",pretty&&(indent+=options),indent},XMLDocType}()}.call(this)},{"./XMLNode":10,underscore:16}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,XMLNode=(require("underscore"),require("./XMLNode")),XMLAttribute=require("./XMLAttribute"),XMLProcessingInstruction=require("./XMLProcessingInstruction");module.exports=function(_super){var key,child=XMLElement,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLElement(parent,name,attributes){var attName,attValue;if(XMLElement.__super__.constructor.call(this,parent),null==name)throw new Error("Missing element name");for(attName in this.name=this.stringify.eleName(name),null==attributes&&(attributes={}),this.children=[],this.instructions=[],this.attributes={},attributes)__hasProp.call(attributes,attName)&&(attValue=attributes[attName],null!=attName)&&null!=attValue&&(this.attributes[attName]=new XMLAttribute(this,attName,attValue))}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLElement.prototype.clone=function(deep){var clonedSelf=new XMLElement(this.parent,this.name,this.attributes,this.value);return deep&&this.children.forEach(function(child){child=child.clone(deep);return(child.parent=clonedSelf).children.push(child)}),clonedSelf},XMLElement.prototype.attribute=function(name,value){if(null==name)throw new Error("Missing attribute name");if(null==value)throw new Error("Missing attribute value");return null==this.attributes&&(this.attributes={}),this.attributes[name]=new XMLAttribute(this,name,value),this},XMLElement.prototype.removeAttribute=function(name){if(null==name)throw new Error("Missing attribute name");return delete this.attributes[name],this},XMLElement.prototype.instruction=function(target,value){target=new XMLProcessingInstruction(this,target,value);return this.instructions.push(target),this},XMLElement.prototype.toString=function(options,level){var name,r,_i,_j,_len,_len1,_ref,_ref1,_ref2,pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",newline=(null!=options?options.newline:void 0)||"\n";for(level=level||0,indent=new Array(level+1).join(indent),r="",_i=0,_len=(_ref=this.instructions).length;_i<_len;_i++)r+=_ref[_i].toString(options,level+1);for(name in pretty&&(r+=indent),r+="<"+this.name,_ref1=this.attributes)__hasProp.call(_ref1,name)&&(r+=_ref1[name].toString(options));if(0===this.children.length)r+="/>",pretty&&(r+=newline);else if(pretty&&1===this.children.length&&null!=this.children[0].value)r=(r=r+">"+this.children[0].value)+"</"+this.name+">"+newline;else{for(r+=">",pretty&&(r+=newline),_j=0,_len1=(_ref2=this.children).length;_j<_len1;_j++)r+=_ref2[_j].toString(options,level+1);pretty&&(r+=indent),r+="</"+this.name+">",pretty&&(r+=newline)}return r},XMLElement.prototype.att=function(name,value){return this.attribute(name,value)},XMLElement.prototype.ins=function(target,value){return this.instruction(target,value)},XMLElement.prototype.a=function(name,value){return this.attribute(name,value)},XMLElement.prototype.i=function(target,value){return this.instruction(target,value)},XMLElement}()}.call(this)},{"./XMLAttribute":3,"./XMLNode":10,"./XMLProcessingInstruction":11,underscore:16}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,_=require("underscore");module.exports=function(){function XMLNode(parent){this.parent=parent,this.stringify=this.parent.stringify}return XMLNode.prototype.element=function(name,attributes,text){var attKey,attVal,item,key,piKey,piVal,val,_i,_len,_ref,lastChild=null;if(_.isObject(attributes=null==attributes?{}:attributes)||(text=(_ref=[attributes,text])[0],attributes=_ref[1]),_.isArray(name))for(_i=0,_len=name.length;_i<_len;_i++)item=name[_i],lastChild=this.element(item);else if(_.isFunction(name))name=name.apply(),lastChild=this.element(name);else if(_.isObject(name)){for(key in name)__hasProp.call(name,key)&&(val=name[key],_.isFunction(val))&&(name[key]=val.apply());for(key in name)__hasProp.call(name,key)&&null==(val=name[key])&&delete name[key];for(attKey in name)__hasProp.call(name,attKey)&&(attVal=name[attKey],this.stringify.convertAttKey)&&0===attKey.indexOf(this.stringify.convertAttKey)&&(this.attribute(attKey.substr(this.stringify.convertAttKey.length),attVal),delete name[attKey]);for(piKey in name)__hasProp.call(name,piKey)&&(piVal=name[piKey],this.stringify.convertPIKey)&&0===piKey.indexOf(this.stringify.convertPIKey)&&(this.instruction(piKey.substr(this.stringify.convertPIKey.length),piVal),delete name[piKey]);for(key in name)__hasProp.call(name,key)&&(val=name[key],_.isObject(val)?this.stringify.convertListKey&&0===key.indexOf(this.stringify.convertListKey)&&_.isArray(val)?lastChild=this.element(val):(lastChild=this.element(key)).element(val):lastChild=this.element(key,val))}else name=""+name,lastChild=this.stringify.convertTextKey&&0===name.indexOf(this.stringify.convertTextKey)?this.text(text):this.stringify.convertCDataKey&&0===name.indexOf(this.stringify.convertCDataKey)?this.cdata(text):this.stringify.convertCommentKey&&0===name.indexOf(this.stringify.convertCommentKey)?this.comment(text):this.stringify.convertRawKey&&0===name.indexOf(this.stringify.convertRawKey)?this.raw(text):this.node(name,attributes,text);return lastChild},XMLNode.prototype.insertBefore=function(name,attributes,text){var i;if(this.isRoot)throw new Error("Cannot insert elements at root level");return i=this.parent.children.indexOf(this),i=this.parent.children.splice(i),name=this.parent.element(name,attributes,text),Array.prototype.push.apply(this.parent.children,i),name},XMLNode.prototype.insertAfter=function(name,attributes,text){var i;if(this.isRoot)throw new Error("Cannot insert elements at root level");return i=this.parent.children.indexOf(this),i=this.parent.children.splice(i+1),name=this.parent.element(name,attributes,text),Array.prototype.push.apply(this.parent.children,i),name},XMLNode.prototype.remove=function(){var i;if(this.isRoot)throw new Error("Cannot remove the root element");return i=this.parent.children.indexOf(this),[].splice.apply(this.parent.children,[i,i-i+1].concat([])),this.parent},XMLNode.prototype.node=function(name,attributes,text){name=new(require("./XMLElement"))(this,name,attributes);return null!=text&&name.text(text),this.children.push(name),name},XMLNode.prototype.text=function(value){value=new(require("./XMLText"))(this,value);return this.children.push(value),this},XMLNode.prototype.cdata=function(value){value=new(require("./XMLCData"))(this,value);return this.children.push(value),this},XMLNode.prototype.comment=function(value){value=new(require("./XMLComment"))(this,value);return this.children.push(value),this},XMLNode.prototype.raw=function(value){value=new(require("./XMLRaw"))(this,value);return this.children.push(value),this},XMLNode.prototype.up=function(){if(this.isRoot)throw new Error("The root node has no parent. Use doc() if you need to get the document object.");return this.parent},XMLNode.prototype.root=function(){var child;if(this.isRoot)return this;for(child=this.parent;!child.isRoot;)child=child.parent;return child},XMLNode.prototype.document=function(){return this.root().documentObject},XMLNode.prototype.end=function(options){return this.document().toString(options)},XMLNode.prototype.prev=function(){var i;if(this.isRoot)throw new Error("Root node has no siblings");if((i=this.parent.children.indexOf(this))<1)throw new Error("Already at the first node");return this.parent.children[i-1]},XMLNode.prototype.next=function(){var i;if(this.isRoot)throw new Error("Root node has no siblings");if(-1===(i=this.parent.children.indexOf(this))||i===this.parent.children.length-1)throw new Error("Already at the last node");return this.parent.children[i+1]},XMLNode.prototype.importXMLBuilder=function(xmlbuilder){xmlbuilder=xmlbuilder.root().clone(!0);return(xmlbuilder.parent=this).children.push(xmlbuilder),xmlbuilder.isRoot=!1,this},XMLNode.prototype.clone=function(deep){return _.clone(this)},XMLNode.prototype.ele=function(name,attributes,text){return this.element(name,attributes,text)},XMLNode.prototype.nod=function(name,attributes,text){return this.node(name,attributes,text)},XMLNode.prototype.txt=function(value){return this.text(value)},XMLNode.prototype.dat=function(value){return this.cdata(value)},XMLNode.prototype.com=function(value){return this.comment(value)},XMLNode.prototype.doc=function(){return this.document()},XMLNode.prototype.e=function(name,attributes,text){return this.element(name,attributes,text)},XMLNode.prototype.n=function(name,attributes,text){return this.node(name,attributes,text)},XMLNode.prototype.t=function(value){return this.text(value)},XMLNode.prototype.d=function(value){return this.cdata(value)},XMLNode.prototype.c=function(value){return this.comment(value)},XMLNode.prototype.r=function(value){return this.raw(value)},XMLNode.prototype.u=function(){return this.up()},XMLNode}()}.call(this)},{"./XMLCData":5,"./XMLComment":6,"./XMLElement":9,"./XMLRaw":12,"./XMLText":14,underscore:16}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){require("underscore");module.exports=function(){function XMLProcessingInstruction(parent,target,value){if(this.stringify=parent.stringify,null==target)throw new Error("Missing instruction target");this.target=this.stringify.insTarget(target),this.value=this.stringify.insValue(value)}return XMLProcessingInstruction.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level).join(indent),indent="",pretty&&(indent+=level),indent=indent+"<?"+this.target,this.value&&(indent+=" "+this.value),indent+="?>",pretty&&(indent+=options),indent},XMLProcessingInstruction}()}.call(this)},{underscore:16}],12:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,XMLNode=(require("underscore"),require("./XMLNode"));module.exports=function(_super){var key,child=XMLRaw,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLRaw(parent,text){if(XMLRaw.__super__.constructor.call(this,parent),null==text)throw new Error("Missing raw text");this.value=this.stringify.raw(text)}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLRaw.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level+1).join(indent),indent="",pretty&&(indent+=level),indent+=this.value,pretty&&(indent+=options),indent},XMLRaw}()}.call(this)},{"./XMLNode":10,underscore:16}],13:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty;module.exports=function(){function XMLStringifier(options){var key,value,_ref,_this=this;for(key in this.assertLegalChar=function(str){return XMLStringifier.prototype.assertLegalChar.apply(_this,arguments)},this.allowSurrogateChars=null!=options?options.allowSurrogateChars:void 0,_ref=(null!=options?options.stringify:void 0)||{})__hasProp.call(_ref,key)&&(value=_ref[key],this[key]=value)}return XMLStringifier.prototype.eleName=function(val){return this.assertLegalChar(val=""+val||"")},XMLStringifier.prototype.eleText=function(val){return this.assertLegalChar(this.escape(val=""+val||""))},XMLStringifier.prototype.cdata=function(val){if((val=""+val||"").match(/]]>/))throw new Error("Invalid CDATA text: "+val);return this.assertLegalChar(val)},XMLStringifier.prototype.comment=function(val){if((val=""+val||"").match(/--/))throw new Error("Comment text cannot contain double-hypen: "+val);return this.assertLegalChar(this.escape(val))},XMLStringifier.prototype.raw=function(val){return""+val||""},XMLStringifier.prototype.attName=function(val){return""+val||""},XMLStringifier.prototype.attValue=function(val){return this.escape(val=""+val||"")},XMLStringifier.prototype.insTarget=function(val){return""+val||""},XMLStringifier.prototype.insValue=function(val){if((val=""+val||"").match(/\?>/))throw new Error("Invalid processing instruction value: "+val);return val},XMLStringifier.prototype.xmlVersion=function(val){if((val=""+val||"").match(/1\.[0-9]+/))return val;throw new Error("Invalid version number: "+val)},XMLStringifier.prototype.xmlEncoding=function(val){if((val=""+val||"").match(/[A-Za-z](?:[A-Za-z0-9._-]|-)*/))return val;throw new Error("Invalid encoding: "+options.val)},XMLStringifier.prototype.xmlStandalone=function(val){return val?"yes":"no"},XMLStringifier.prototype.xmlExternalSubset=function(val){return""+val||""},XMLStringifier.prototype.convertAttKey="@",XMLStringifier.prototype.convertPIKey="?",XMLStringifier.prototype.convertTextKey="#text",XMLStringifier.prototype.convertCDataKey="#cdata",XMLStringifier.prototype.convertCommentKey="#comment",XMLStringifier.prototype.convertRawKey="#raw",XMLStringifier.prototype.convertListKey="#list",XMLStringifier.prototype.assertLegalChar=function(str){var chars=this.allowSurrogateChars?/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uFFFE-\uFFFF]/:/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/,chars=str.match(chars);if(chars)throw new Error("Invalid character ("+chars+") in string: "+str+" at index "+chars.index);return str},XMLStringifier.prototype.escape=function(str){return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&apos;").replace(/"/g,"&quot;")},XMLStringifier}()}.call(this)},{}],14:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var __hasProp={}.hasOwnProperty,XMLNode=(require("underscore"),require("./XMLNode"));module.exports=function(_super){var key,child=XMLText,parent=XMLNode;for(key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);function ctor(){this.constructor=child}function XMLText(parent,text){if(this.parent=parent,XMLText.__super__.constructor.call(this,parent),null==text)throw new Error("Missing element text");this.value=this.stringify.eleText(text)}return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,XMLText.prototype.toString=function(options,level){var pretty=(null!=options?options.pretty:void 0)||!1,indent=(null!=options?options.indent:void 0)||"  ",options=(null!=options?options.newline:void 0)||"\n";return level=level||0,level=new Array(level+1).join(indent),indent="",pretty&&(indent+=level),indent+=this.value,pretty&&(indent+=options),indent},XMLText}()}.call(this)},{"./XMLNode":10,underscore:16}],15:[function(require,module,exports){
// Generated by CoffeeScript 1.6.1
!function(){var _=require("underscore"),XMLBuilder=require("./XMLBuilder");module.exports.create=function(name,xmldec,doctype,options){return options=_.extend({},xmldec,doctype,options),new XMLBuilder(name,options).root()}}.call(this)},{"./XMLBuilder":4,underscore:16}],16:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
!function(){function lookupIterator(value){return _.isFunction(value)?value:function(obj){return obj[value]}}function group(behavior){return function(obj,value,context){var result={},iterator=null==value?_.identity:lookupIterator(value);return each(obj,function(value,index){index=iterator.call(context,value,index,obj);behavior(result,index,value)}),result}}function flatten(input,shallow,output){return shallow&&_.every(input,_.isArray)?concat.apply(output,input):(each(input,function(value){_.isArray(value)||_.isArguments(value)?shallow?push.apply(output,value):flatten(value,shallow,output):output.push(value)}),output)}function ctor(){}function eq(a,b,aStack,bStack){
// Identical objects are equal. `0 === -0`, but they aren't identical.
// See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
if(a===b)return 0!==a||1/a==1/b;
// A strict comparison is necessary because `null == undefined`.
if(null==a||null==b)return a===b;
// Unwrap any wrapped objects.
a instanceof _&&(a=a._wrapped),b instanceof _&&(b=b._wrapped);
// Compare `[[Class]]` names.
var className=toString.call(a);if(className!=toString.call(b))return!1;switch(className){
// Strings, numbers, dates, and booleans are compared by value.
case"[object String]":
// Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
// equivalent to `new String("5")`.
return a==String(b);case"[object Number]":
// `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
// other numeric values.
return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case"[object Date]":case"[object Boolean]":
// Coerce dates and booleans to numeric primitive values. Dates are compared by their
// millisecond representations. Note that invalid dates with millisecond representations
// of `NaN` are not equivalent.
return+a==+b;
// RegExps are compared by their source patterns and flags.
case"[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if("object"!=typeof a||"object"!=typeof b)return!1;
// Assume equality for cyclic structures. The algorithm for detecting cyclic
// structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
for(var length=aStack.length;length--;)
// Linear search. Performance is inversely proportional to the number of
// unique nested structures.
if(aStack[length]==a)return bStack[length]==b;
// Objects with different constructors are not equivalent, but `Object`s
// from different frames are.
var aCtor=a.constructor,bCtor=b.constructor;if(aCtor!==bCtor&&!(_.isFunction(aCtor)&&aCtor instanceof aCtor&&_.isFunction(bCtor)&&bCtor instanceof bCtor))return!1;
// Add the first object to the stack of traversed objects.
aStack.push(a),bStack.push(b);var size=0,result=!0;
// Recursively compare objects and arrays.
if("[object Array]"==className){if(result=(
// Compare array lengths to determine if a deep comparison is necessary.
size=a.length)==b.length)
// Deep compare the contents, ignoring non-numeric properties.
for(;size--&&(result=eq(a[size],b[size],aStack,bStack)););}else{
// Deep compare objects.
for(var key in a)if(_.has(a,key)&&(
// Count the expected number of properties.
size++,!(result=_.has(b,key)&&eq(a[key],b[key],aStack,bStack))))break;
// Ensure that both objects contain the same number of properties.
if(result){for(key in b)if(_.has(b,key)&&!size--)break;result=!size}}
// Remove the first object from the stack of traversed objects.
return aStack.pop(),bStack.pop(),result}
// Baseline setup
// --------------
// Establish the root object, `window` in the browser, or `exports` on the server.
var root=this,previousUnderscore=root._,breaker={},ArrayProto=Array.prototype,ObjProto=Object.prototype,FuncProto=Function.prototype,push=ArrayProto.push,slice=ArrayProto.slice,concat=ArrayProto.concat,toString=ObjProto.toString,hasOwnProperty=ObjProto.hasOwnProperty,nativeForEach=ArrayProto.forEach,nativeMap=ArrayProto.map,nativeReduce=ArrayProto.reduce,nativeReduceRight=ArrayProto.reduceRight,nativeFilter=ArrayProto.filter,nativeEvery=ArrayProto.every,nativeSome=ArrayProto.some,nativeIndexOf=ArrayProto.indexOf,nativeLastIndexOf=ArrayProto.lastIndexOf,ObjProto=Array.isArray,nativeKeys=Object.keys,nativeBind=FuncProto.bind,_=function(obj){return obj instanceof _?obj:this instanceof _?void(this._wrapped=obj):new _(obj)},each=(
// Export the Underscore object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object via a string identifier,
// for Closure Compiler "advanced" mode.
void 0!==exports?(exports=void 0!==module&&module.exports?module.exports=_:exports)._=_:root._=_,
// Current version.
_.VERSION="1.5.2",_.each=_.forEach=function(obj,iterator,context){if(null!=obj)if(nativeForEach&&obj.forEach===nativeForEach)obj.forEach(iterator,context);else if(obj.length===+obj.length){for(var i=0,length=obj.length;i<length;i++)if(iterator.call(context,obj[i],i,obj)===breaker)return}else for(var keys=_.keys(obj),i=0,length=keys.length;i<length;i++)if(iterator.call(context,obj[keys[i]],keys[i],obj)===breaker)return}),reduceError=(
// Return the results of applying the iterator to each element.
// Delegates to **ECMAScript 5**'s native `map` if available.
_.map=_.collect=function(obj,iterator,context){var results=[];if(null!=obj){if(nativeMap&&obj.map===nativeMap)return obj.map(iterator,context);each(obj,function(value,index,list){results.push(iterator.call(context,value,index,list))})}return results},"Reduce of empty array with no initial value"),any=(
// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
_.reduce=_.foldl=_.inject=function(obj,iterator,memo,context){var initial=2<arguments.length;if(null==obj&&(obj=[]),nativeReduce&&obj.reduce===nativeReduce)return context&&(iterator=_.bind(iterator,context)),initial?obj.reduce(iterator,memo):obj.reduce(iterator);if(each(obj,function(value,index,list){initial?memo=iterator.call(context,memo,value,index,list):(memo=value,initial=!0)}),initial)return memo;throw new TypeError(reduceError)},
// The right-associative version of reduce, also known as `foldr`.
// Delegates to **ECMAScript 5**'s native `reduceRight` if available.
_.reduceRight=_.foldr=function(obj,iterator,memo,context){var initial=2<arguments.length;if(null==obj&&(obj=[]),nativeReduceRight&&obj.reduceRight===nativeReduceRight)return context&&(iterator=_.bind(iterator,context)),initial?obj.reduceRight(iterator,memo):obj.reduceRight(iterator);var keys,length=obj.length;if(length!==+length&&(keys=_.keys(obj),length=keys.length),each(obj,function(value,index,list){index=keys?keys[--length]:--length,initial?memo=iterator.call(context,memo,obj[index],index,list):(memo=obj[index],initial=!0)}),initial)return memo;throw new TypeError(reduceError)},
// Return the first value which passes a truth test. Aliased as `detect`.
_.find=_.detect=function(obj,iterator,context){var result;return any(obj,function(value,index,list){if(iterator.call(context,value,index,list))return result=value,!0}),result},
// Return all the elements that pass a truth test.
// Delegates to **ECMAScript 5**'s native `filter` if available.
// Aliased as `select`.
_.filter=_.select=function(obj,iterator,context){var results=[];if(null!=obj){if(nativeFilter&&obj.filter===nativeFilter)return obj.filter(iterator,context);each(obj,function(value,index,list){iterator.call(context,value,index,list)&&results.push(value)})}return results},
// Return all the elements for which a truth test fails.
_.reject=function(obj,iterator,context){return _.filter(obj,function(value,index,list){return!iterator.call(context,value,index,list)},context)},
// Determine whether all of the elements match a truth test.
// Delegates to **ECMAScript 5**'s native `every` if available.
// Aliased as `all`.
_.every=_.all=function(obj,iterator,context){iterator=iterator||_.identity;var result=!0;return null==obj?result:nativeEvery&&obj.every===nativeEvery?obj.every(iterator,context):(each(obj,function(value,index,list){if(!(result=result&&iterator.call(context,value,index,list)))return breaker}),!!result)},_.some=_.any=function(obj,iterator,context){iterator=iterator||_.identity;var result=!1;return null==obj?result:nativeSome&&obj.some===nativeSome?obj.some(iterator,context):(each(obj,function(value,index,list){if(result=result||iterator.call(context,value,index,list))return breaker}),!!result)}),entityMap=(
// Perform a deep comparison to check if two objects are equal.
// Determine if the array or object contains a given value (using `===`).
// Aliased as `include`.
_.contains=_.include=function(obj,target){return null!=obj&&(nativeIndexOf&&obj.indexOf===nativeIndexOf?-1!=obj.indexOf(target):any(obj,function(value){return value===target}))},
// Invoke a method (with arguments) on every item in a collection.
_.invoke=function(obj,method){var args=slice.call(arguments,2),isFunc=_.isFunction(method);return _.map(obj,function(value){return(isFunc?method:value[method]).apply(value,args)})},
// Convenience version of a common use case of `map`: fetching a property.
_.pluck=function(obj,key){return _.map(obj,function(value){return value[key]})},
// Convenience version of a common use case of `filter`: selecting only objects
// containing specific `key:value` pairs.
_.where=function(obj,attrs,first){return _.isEmpty(attrs)?first?void 0:[]:_[first?"find":"filter"](obj,function(value){for(var key in attrs)if(attrs[key]!==value[key])return!1;return!0})},
// Convenience version of a common use case of `find`: getting the first object
// containing specific `key:value` pairs.
_.findWhere=function(obj,attrs){return _.where(obj,attrs,!0)},
// Return the maximum element or (element-based computation).
// Can't optimize arrays of integers longer than 65,535 elements.
// See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
_.max=function(obj,iterator,context){var result;return!iterator&&_.isArray(obj)&&obj[0]===+obj[0]&&obj.length<65535?Math.max.apply(Math,obj):!iterator&&_.isEmpty(obj)?-1/0:(result={computed:-1/0,value:-1/0},each(obj,function(value,index,list){index=iterator?iterator.call(context,value,index,list):value;index>result.computed&&(result={value:value,computed:index})}),result.value)},
// Return the minimum element (or element-based computation).
_.min=function(obj,iterator,context){var result;return!iterator&&_.isArray(obj)&&obj[0]===+obj[0]&&obj.length<65535?Math.min.apply(Math,obj):!iterator&&_.isEmpty(obj)?1/0:(result={computed:1/0,value:1/0},each(obj,function(value,index,list){index=iterator?iterator.call(context,value,index,list):value;index<result.computed&&(result={value:value,computed:index})}),result.value)},
// Shuffle an array, using the modern version of the 
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
_.shuffle=function(obj){var rand,index=0,shuffled=[];return each(obj,function(value){rand=_.random(index++),shuffled[index-1]=shuffled[rand],shuffled[rand]=value}),shuffled},
// Sample **n** random values from an array.
// If **n** is not specified, returns a single random element from the array.
// The internal `guard` argument allows it to work with `map`.
_.sample=function(obj,n,guard){return arguments.length<2||guard?obj[_.random(obj.length-1)]:_.shuffle(obj).slice(0,Math.max(0,n))},
// Sort the object's values by a criterion produced by an iterator.
_.sortBy=function(obj,value,context){var iterator=lookupIterator(value);return _.pluck(_.map(obj,function(value,index,list){return{value:value,index:index,criteria:iterator.call(context,value,index,list)}}).sort(function(left,right){var a=left.criteria,b=right.criteria;if(a!==b){if(b<a||void 0===a)return 1;if(a<b||void 0===b)return-1}return left.index-right.index}),"value")},
// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
_.groupBy=group(function(result,key,value){(_.has(result,key)?result[key]:result[key]=[]).push(value)}),
// Indexes the object's values by a criterion, similar to `groupBy`, but for
// when you know that your index values will be unique.
_.indexBy=group(function(result,key,value){result[key]=value}),
// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
_.countBy=group(function(result,key){_.has(result,key)?result[key]++:result[key]=1}),
// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
_.sortedIndex=function(array,obj,iterator,context){for(var value=(iterator=null==iterator?_.identity:lookupIterator(iterator)).call(context,obj),low=0,high=array.length;low<high;){var mid=low+high>>>1;iterator.call(context,array[mid])<value?low=1+mid:high=mid}return low},
// Safely create a real, live array from anything iterable.
_.toArray=function(obj){return obj?_.isArray(obj)?slice.call(obj):obj.length===+obj.length?_.map(obj,_.identity):_.values(obj):[]},
// Return the number of elements in an object.
_.size=function(obj){return null==obj?0:(obj.length===+obj.length?obj:_.keys(obj)).length},
// Array Functions
// ---------------
// Get the first element of an array. Passing **n** will return the first N
// values in the array. Aliased as `head` and `take`. The **guard** check
// allows it to work with `_.map`.
_.first=_.head=_.take=function(array,n,guard){if(null!=array)return null==n||guard?array[0]:slice.call(array,0,n)},
// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N. The **guard** check allows it to work with
// `_.map`.
_.initial=function(array,n,guard){return slice.call(array,0,array.length-(null==n||guard?1:n))},
// Get the last element of an array. Passing **n** will return the last N
// values in the array. The **guard** check allows it to work with `_.map`.
_.last=function(array,n,guard){if(null!=array)return null==n||guard?array[array.length-1]:slice.call(array,Math.max(array.length-n,0))},
// Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
// Especially useful on the arguments object. Passing an **n** will return
// the rest N values in the array. The **guard**
// check allows it to work with `_.map`.
_.rest=_.tail=_.drop=function(array,n,guard){return slice.call(array,null==n||guard?1:n)},
// Trim out all falsy values from an array.
_.compact=function(array){return _.filter(array,_.identity)},
// Flatten out an array, either recursively (by default), or just one level.
_.flatten=function(array,shallow){return flatten(array,shallow,[])},
// Return a version of the array that does not contain the specified value(s).
_.without=function(array){return _.difference(array,slice.call(arguments,1))},
// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// Aliased as `unique`.
_.uniq=_.unique=function(array,isSorted,iterator,context){_.isFunction(isSorted)&&(context=iterator,iterator=isSorted,isSorted=!1);var iterator=iterator?_.map(array,iterator,context):array,results=[],seen=[];return each(iterator,function(value,index){(isSorted?index&&seen[seen.length-1]===value:_.contains(seen,value))||(seen.push(value),results.push(array[index]))}),results},
// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
_.union=function(){return _.uniq(_.flatten(arguments,!0))},
// Produce an array that contains every item shared between all the
// passed-in arrays.
_.intersection=function(array){var rest=slice.call(arguments,1);return _.filter(_.uniq(array),function(item){return _.every(rest,function(other){return 0<=_.indexOf(other,item)})})},
// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
_.difference=function(array){var rest=concat.apply(ArrayProto,slice.call(arguments,1));return _.filter(array,function(value){return!_.contains(rest,value)})},
// Zip together multiple lists into a single array -- elements that share
// an index go together.
_.zip=function(){for(var length=_.max(_.pluck(arguments,"length").concat(0)),results=new Array(length),i=0;i<length;i++)results[i]=_.pluck(arguments,""+i);return results},
// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values.
_.object=function(list,values){if(null==list)return{};for(var result={},i=0,length=list.length;i<length;i++)values?result[list[i]]=values[i]:result[list[i][0]]=list[i][1];return result},
// If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
// we need this function. Return the position of the first occurrence of an
// item in an array, or -1 if the item is not included in the array.
// Delegates to **ECMAScript 5**'s native `indexOf` if available.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
_.indexOf=function(array,item,isSorted){if(null!=array){var i=0,length=array.length;if(isSorted){if("number"!=typeof isSorted)return array[i=_.sortedIndex(array,item)]===item?i:-1;i=isSorted<0?Math.max(0,length+isSorted):isSorted}if(nativeIndexOf&&array.indexOf===nativeIndexOf)return array.indexOf(item,isSorted);for(;i<length;i++)if(array[i]===item)return i}return-1},
// Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
_.lastIndexOf=function(array,item,from){if(null!=array){var hasIndex=null!=from;if(nativeLastIndexOf&&array.lastIndexOf===nativeLastIndexOf)return hasIndex?array.lastIndexOf(item,from):array.lastIndexOf(item);for(var i=hasIndex?from:array.length;i--;)if(array[i]===item)return i}return-1},
// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](http://docs.python.org/library/functions.html#range).
_.range=function(start,stop,step){arguments.length<=1&&(stop=start||0,start=0),step=arguments[2]||1;for(var length=Math.max(Math.ceil((stop-start)/step),0),idx=0,range=new Array(length);idx<length;)range[idx++]=start,start+=step;return range},
// Create a function bound to a given object (assigning `this`, and arguments,
// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
// available.
_.bind=function(func,context){var args,bound;if(nativeBind&&func.bind===nativeBind)return nativeBind.apply(func,slice.call(arguments,1));if(_.isFunction(func))return args=slice.call(arguments,2),bound=function(){if(!(this instanceof bound))return func.apply(context,args.concat(slice.call(arguments)));ctor.prototype=func.prototype;var self=new ctor,result=(ctor.prototype=null,func.apply(self,args.concat(slice.call(arguments))));return Object(result)===result?result:self};throw new TypeError},
// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context.
_.partial=function(func){var args=slice.call(arguments,1);return function(){return func.apply(this,args.concat(slice.call(arguments)))}},
// Bind all of an object's methods to that object. Useful for ensuring that
// all callbacks defined on an object belong to it.
_.bindAll=function(obj){var funcs=slice.call(arguments,1);if(0===funcs.length)throw new Error("bindAll must be passed function names");return each(funcs,function(f){obj[f]=_.bind(obj[f],obj)}),obj},
// Memoize an expensive function by storing its results.
_.memoize=function(func,hasher){var memo={};return hasher=hasher||_.identity,function(){var key=hasher.apply(this,arguments);return _.has(memo,key)?memo[key]:memo[key]=func.apply(this,arguments)}},
// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
_.delay=function(func,wait){var args=slice.call(arguments,2);return setTimeout(function(){return func.apply(null,args)},wait)},
// Defers a function, scheduling it to run after the current call stack has
// cleared.
_.defer=function(func){return _.delay.apply(_,[func,1].concat(slice.call(arguments,1)))},
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
_.throttle=function(func,wait,options){function later(){previous=!1===options.leading?0:new Date,timeout=null,result=func.apply(context,args)}var context,args,result,timeout=null,previous=0;options=options||{};return function(){var now=new Date,remaining=(previous||!1!==options.leading||(previous=now),wait-(now-previous));return context=this,args=arguments,remaining<=0?(clearTimeout(timeout),timeout=null,previous=now,result=func.apply(context,args)):timeout||!1===options.trailing||(timeout=setTimeout(later,remaining)),result}},
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
_.debounce=function(func,wait,immediate){var timeout,args,context,timestamp,result;return function(){context=this,args=arguments,timestamp=new Date;var later=function(){var last=new Date-timestamp;last<wait?timeout=setTimeout(later,wait-last):(timeout=null,immediate||(result=func.apply(context,args)))},callNow=immediate&&!timeout;return timeout=timeout||setTimeout(later,wait),result=callNow?func.apply(context,args):result}},
// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
_.once=function(func){var memo,ran=!1;return function(){return ran||(ran=!0,memo=func.apply(this,arguments),func=null),memo}},
// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
_.wrap=function(func,wrapper){return function(){var args=[func];return push.apply(args,arguments),wrapper.apply(this,args)}},
// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
_.compose=function(){var funcs=arguments;return function(){for(var args=arguments,i=funcs.length-1;0<=i;i--)args=[funcs[i].apply(this,args)];return args[0]}},
// Returns a function that will only be executed after being called N times.
_.after=function(times,func){return function(){if(--times<1)return func.apply(this,arguments)}},
// Object Functions
// ----------------
// Retrieve the names of an object's properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`
_.keys=nativeKeys||function(obj){if(obj!==Object(obj))throw new TypeError("Invalid object");var key,keys=[];for(key in obj)_.has(obj,key)&&keys.push(key);return keys},
// Retrieve the values of an object's properties.
_.values=function(obj){for(var keys=_.keys(obj),length=keys.length,values=new Array(length),i=0;i<length;i++)values[i]=obj[keys[i]];return values},
// Convert an object into a list of `[key, value]` pairs.
_.pairs=function(obj){for(var keys=_.keys(obj),length=keys.length,pairs=new Array(length),i=0;i<length;i++)pairs[i]=[keys[i],obj[keys[i]]];return pairs},
// Invert the keys and values of an object. The values must be serializable.
_.invert=function(obj){for(var result={},keys=_.keys(obj),i=0,length=keys.length;i<length;i++)result[obj[keys[i]]]=keys[i];return result},
// Return a sorted list of the function names available on the object.
// Aliased as `methods`
_.functions=_.methods=function(obj){var key,names=[];for(key in obj)_.isFunction(obj[key])&&names.push(key);return names.sort()},
// Extend a given object with all the properties in passed-in object(s).
_.extend=function(obj){return each(slice.call(arguments,1),function(source){if(source)for(var prop in source)obj[prop]=source[prop]}),obj},
// Return a copy of the object only containing the whitelisted properties.
_.pick=function(obj){var copy={},keys=concat.apply(ArrayProto,slice.call(arguments,1));return each(keys,function(key){key in obj&&(copy[key]=obj[key])}),copy},
// Return a copy of the object without the blacklisted properties.
_.omit=function(obj){var key,copy={},keys=concat.apply(ArrayProto,slice.call(arguments,1));for(key in obj)_.contains(keys,key)||(copy[key]=obj[key]);return copy},
// Fill in a given object with default properties.
_.defaults=function(obj){return each(slice.call(arguments,1),function(source){if(source)for(var prop in source)void 0===obj[prop]&&(obj[prop]=source[prop])}),obj},
// Create a (shallow-cloned) duplicate of an object.
_.clone=function(obj){return _.isObject(obj)?_.isArray(obj)?obj.slice():_.extend({},obj):obj},
// Invokes interceptor with the obj, and then returns obj.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
_.tap=function(obj,interceptor){return interceptor(obj),obj},_.isEqual=function(a,b){return eq(a,b,[],[])},
// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
_.isEmpty=function(obj){if(null!=obj){if(_.isArray(obj)||_.isString(obj))return 0===obj.length;for(var key in obj)if(_.has(obj,key))return!1}return!0},
// Is a given value a DOM element?
_.isElement=function(obj){return!(!obj||1!==obj.nodeType)},
// Is a given value an array?
// Delegates to ECMA5's native Array.isArray
_.isArray=ObjProto||function(obj){return"[object Array]"==toString.call(obj)},
// Is a given variable an object?
_.isObject=function(obj){return obj===Object(obj)},
// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
each(["Arguments","Function","String","Number","Date","RegExp"],function(name){_["is"+name]=function(obj){return toString.call(obj)=="[object "+name+"]"}}),
// Define a fallback version of the method in browsers (ahem, IE), where
// there isn't any inspectable "Arguments" type.
_.isArguments(arguments)||(_.isArguments=function(obj){return!(!obj||!_.has(obj,"callee"))}),
// Optimize `isFunction` if appropriate.
"function"!=typeof/./&&(_.isFunction=function(obj){return"function"==typeof obj}),
// Is a given object a finite number?
_.isFinite=function(obj){return isFinite(obj)&&!isNaN(parseFloat(obj))},
// Is the given value `NaN`? (NaN is the only number which does not equal itself).
_.isNaN=function(obj){return _.isNumber(obj)&&obj!=+obj},
// Is a given value a boolean?
_.isBoolean=function(obj){return!0===obj||!1===obj||"[object Boolean]"==toString.call(obj)},
// Is a given value equal to null?
_.isNull=function(obj){return null===obj},
// Is a given variable undefined?
_.isUndefined=function(obj){return void 0===obj},
// Shortcut function for checking if an object has a given property directly
// on itself (in other words, not on a prototype).
_.has=function(obj,key){return hasOwnProperty.call(obj,key)},
// Utility Functions
// -----------------
// Run Underscore.js in *noConflict* mode, returning the `_` variable to its
// previous owner. Returns a reference to the Underscore object.
_.noConflict=function(){return root._=previousUnderscore,this},
// Keep the identity function around for default iterators.
_.identity=function(value){return value},
// Run a function **n** times.
_.times=function(n,iterator,context){for(var accum=Array(Math.max(0,n)),i=0;i<n;i++)accum[i]=iterator.call(context,i);return accum},
// Return a random integer between min and max (inclusive).
_.random=function(min,max){return null==max&&(max=min,min=0),min+Math.floor(Math.random()*(max-min+1))},{escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}}),entityRegexes=(entityMap.unescape=_.invert(entityMap.escape),{escape:new RegExp("["+_.keys(entityMap.escape).join("")+"]","g"),unescape:new RegExp("("+_.keys(entityMap.unescape).join("|")+")","g")}),idCounter=(
// Functions for escaping and unescaping strings to/from HTML interpolation.
_.each(["escape","unescape"],function(method){_[method]=function(string){return null==string?"":(""+string).replace(entityRegexes[method],function(match){return entityMap[method][match]})}}),
// If the value of the named `property` is a function then invoke it with the
// `object` as context; otherwise, return it.
_.result=function(object,property){if(null!=object)return property=object[property],_.isFunction(property)?property.call(object):property},
// Add your own custom functions to the Underscore object.
_.mixin=function(obj){each(_.functions(obj),function(name){var func=_[name]=obj[name];_.prototype[name]=function(){var args=[this._wrapped];return push.apply(args,arguments),result.call(this,func.apply(_,args))}})},0),noMatch=(_.uniqueId=function(prefix){var id=++idCounter+"";return prefix?prefix+id:id},
// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
_.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g},/(.)^/),escapes={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"},escaper=/\\|'|\r|\n|\t|\u2028|\u2029/g,result=(
// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
_.template=function(text,data,settings){settings=_.defaults({},settings,_.templateSettings);var render,matcher=new RegExp([(settings.escape||noMatch).source,(settings.interpolate||noMatch).source,(settings.evaluate||noMatch).source].join("|")+"|$","g"),index=0,source="__p+='";text.replace(matcher,function(match,escape,interpolate,evaluate,offset){return source+=text.slice(index,offset).replace(escaper,function(match){return"\\"+escapes[match]}),escape&&(source+="'+\n((__t=("+escape+"))==null?'':_.escape(__t))+\n'"),interpolate&&(source+="'+\n((__t=("+interpolate+"))==null?'':__t)+\n'"),evaluate&&(source+="';\n"+evaluate+"\n__p+='"),index=offset+match.length,match}),source+="';\n",source="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+(
// If a variable is not specified, place data values in local scope.
source=settings.variable?source:"with(obj||{}){\n"+source+"}\n")+"return __p;\n";try{render=new Function(settings.variable||"obj","_",source)}catch(e){throw e.source=source,e}return data?render(data,_):(
// Provide the compiled function source as a convenience for precompilation.
(matcher=function(data){return render.call(this,data,_)}).source="function("+(settings.variable||"obj")+"){\n"+source+"}",matcher)},
// Add a "chain" function, which will delegate to the wrapper.
_.chain=function(obj){return _(obj).chain()},function(obj){return this._chain?_(obj).chain():obj});
// Save the previous value of the `_` variable.
// Add all of the Underscore functions to the wrapper object.
_.mixin(_),
// Add all mutator Array functions to the wrapper.
each(["pop","push","reverse","shift","sort","splice","unshift"],function(name){var method=ArrayProto[name];_.prototype[name]=function(){var obj=this._wrapped;return method.apply(obj,arguments),"shift"!=name&&"splice"!=name||0!==obj.length||delete obj[0],result.call(this,obj)}}),
// Add all accessor Array functions to the wrapper.
each(["concat","join","slice"],function(name){var method=ArrayProto[name];_.prototype[name]=function(){return result.call(this,method.apply(this._wrapped,arguments))}}),_.extend(_.prototype,{
// Start chaining a wrapped Underscore object.
chain:function(){return this._chain=!0,this},
// Extracts the result from a wrapped and chained object.
value:function(){return this._wrapped}})}.call(this)},{}],17:[function(require,module,exports){function Point(x,y){this.x=x,this.y=y}Point.prototype.distance_to_point=function(p){return Math.sqrt(Math.pow(p.x-this.x,2)+Math.pow(p.y-this.y,2))},module.exports=Point},{}],18:[function(require,module,exports){function Polyline(){this.points=[]}
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
var Point=require("./point");Polyline.prototype.append=function(p){
// Push is slllllllllow
this.points.push(p)},Polyline.prototype.random_points_in_bounds=function(x,y,width,height,count){for(var i=0;i<count;i++){var x_pos=Math.random()*width,y_pos=Math.random()*height,x_pos=new Point(x+x_pos,y+y_pos);this.append(x_pos)}}
// http://www.gamasutra.com/features/20000210/lander_l3.htm
,Polyline.prototype.nearest_point_on_line=function(a,b,c){
// SEE IF a IS THE NEAREST POINT - ANGLE IS OBTUSE
var nearest_x,dot_ta=(c.x-a.x)*(b.x-a.x)+(c.y-a.y)*(b.y-a.y);return dot_ta<=0?new Point(a.x,a.y):
// SEE IF b IS THE NEAREST POINT - ANGLE IS OBTUSE
(c=(c.x-b.x)*(a.x-b.x)+(c.y-b.y)*(a.y-b.y))<=0?new Point(b.x,b.y):(nearest_x=a.x+(b.x-a.x)*dot_ta/(dot_ta+c),b=a.y+(b.y-a.y)*dot_ta/(dot_ta+c),new Point(nearest_x,b))},Polyline.prototype.distance_from_line_to_point=function(a,b,c){return this.nearest_point_on_line(a,b,c).distance_to_point(c)},Polyline.prototype.distance_to_point=function(p){for(var distance_to_poly=Number.MAX_VALUE,i=1;i<this.points.length;i++){var a=this.points[i-1],b=this.points[i],a=this.distance_from_line_to_point(a,b,p);a<distance_to_poly&&(distance_to_poly=a)}return distance_to_poly},Polyline.prototype.top_leftmost_point=function(){for(var top_leftmost=this.points[0],i=1;i<this.points.length;i++)(this.points[i].y<=top_leftmost.y||this.points[i].y==top_leftmost.y&&this.points[i].x<top_leftmost.x)&&(top_leftmost=this.points[i]);return new Point(top_leftmost.x,top_leftmost.y)},module.exports=Polyline},{"./point":17}],19:[function(require,module,exports){function Turtle(position,forward_step,turn_step){this.direction=90,this.position=position,this.forward_step=forward_step,this.turn_step=turn_step}
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
var Point=require("./point"),DEGREES_TO_RADIANS=2*Math.PI/360;Turtle.prototype.left=function(){this.direction-=this.turn_step},Turtle.prototype.right=function(){this.direction+=this.turn_step},Turtle.prototype.forward=function(){this.position=this.next_point_would_be()},Turtle.prototype.next_point_would_be=function(){var x=this.position.x+this.forward_step*Math.sin(this.direction*DEGREES_TO_RADIANS),y=this.position.y+this.forward_step*Math.cos(this.direction*DEGREES_TO_RADIANS);return new Point(x,y)},module.exports=Turtle},{"./point":17}],artblocks:[function(require,module,exports){
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
const DrawingSVG=require("./drawing_svg"),WIDTH=1920,HEIGHT=1080;let svg,drawing;function draw(){drawing.update()?(drawing.drawInProgress(),requestAnimationFrame(draw)):drawing.drawComplete()}document.addEventListener("DOMContentLoaded",function init(){!function createSVGElement(){var existingSvg=document.getElementById("svg");null!=existingSvg&&document.body.remove(existingSvg),(svg=document.createElementNS("http://www.w3.org/2000/svg","svg")).id="svg",svg.setAttribute("viewBox",`0 0 ${WIDTH} `+HEIGHT),(existingSvg=svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","rect"))).id="background",existingSvg.style.fill="white",existingSvg.setAttribute("width",WIDTH),existingSvg.setAttribute("height",HEIGHT),svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path")).id="skeleton",svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path")).id="fill",svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","path")).id="outline",document.body.appendChild(svg)}(),drawing=new DrawingSVG(svg,12,tokenData.hash),requestAnimationFrame(draw)})},{"./drawing_svg":2}]},{},["artblocks"]);
