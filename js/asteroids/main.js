// Copyright 2016 Cory Douthat
"use strict";

var draw_interval_id;
var phys_interval_id;
var canvas;
var time_int = 0.033;

function main(canvas_id)
{
	canvas = document.getElementById(canvas_id);

	// Initialize WebGL
	if (!InitWebGL(canvas))
	{
        throw("Failed to initialize WebGL");
    }
    else
    {
    	//InitTextures();

    	SetupGame();

        ResizeCanvas();

		// DrawScene is in webgl_main.js
    	draw_interval_id = setInterval(DrawScene, 15);
		// UpdateMotion in physics.js
		phys_interval_id = setInterval(function(){
			UpdatePhysics(time_int)
		}, 30);
    }
}

// ResizeCanvas()
// Resize WebGL canvas
function ResizeCanvas()
{
	// Resize canvas element (fill screen)
	canvas.width = $(document).width();
	canvas.height = $(document).height();

    // Resize GL Viewport
    ResizeWebGL(canvas.width, canvas.height);
}

$(window).resize(function()
{
    ResizeCanvas();
});
