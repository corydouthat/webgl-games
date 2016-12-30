// Copyright 2016 Cory Douthat
"use strict";

var draw_interval_id;
var canvas;

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
    	InitTextures();

    	SetupGame();

        ResizeCanvas();

    	draw_interval_id = setInterval(DrawScene, 15);	// DrawScene is in webgl_main.js
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