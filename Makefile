JS = point.js turtle.js polyline.js drawing.js drawing_canvas.js

draw_something_canvas.js: $(JS)
	browserify -r ./drawing_canvas.js:drawing_canvas --outfile ${@}

clean:
	rm -f draw_something_canvas.js
