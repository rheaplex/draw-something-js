SHARED = MersenneTwister.js point.js turtle.js polyline.js palette.js drawing.js

all: draw_something_canvas.js draw_something_svg.js

draw_something_canvas.js: $(SHARED) drawing_canvas.js
	browserify -r ./drawing_canvas.js:drawing_canvas \
		--outfile ${@} drawing_canvas.js

draw_something_svg.js: $(SHARED) drawing_svg.js
	browserify -r ./drawing_svg.js:drawing_svg \
		--outfile ${@} drawing_svg.js

clean:
	rm -f draw_something_canvas.js
	rm -f draw_something_svg.js
