// Copyright 2016 Cory Douthat
"use strict";

var gl;
var gl_canvas;
var gl_canvas_aspect = 1.0;         // Aspect ratio
var gl_canvas_width = null;			// Canvas width
var gl_view_pos = vec2.create();	// Center of viewport in 2D space
var gl_view_zoom = 1.0;				// Zoom level 1 to TBD
var textures_rdy = true;            // Defines whether textures are ready
var mv_matrix = mat3.create();      // Modelview matrix
var mv_matrix_stack = [];           // Matrix stack

// InitWebGL()
// Get WebGL context
function InitWebGL(canvas)
{
	gl_canvas = canvas;
    gl = null;

	try
    {
		// Try to grab the standard context, or fall back to experimental
		gl = gl_canvas.getContext("webgl") ||
			 gl_canvas.getContext("experimental-webgl");
	}
	catch(e)
    {
		throw(e);
	}

	// Check initialization
	if (!gl)
    {
		gl = null;
        return gl;
	}

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Initialize shaders
	if (!InitShaders())
    {
        return null;
    }

	ResizeWebGL();

	return gl;
}

// ResizeWebGL()
// Update viewport size and resolution
function ResizeWebGL(width, height)
{
    // Resize viewport
    gl.viewport(0, 0, width, height);

	// Update width variable
	gl_canvas_width = width;

    // Update resolution for projection matrix
    gl_canvas_aspect = width / height;
}

// DrawScene()
// Render WebGL scene in the canvas
function DrawScene()
{
    var obj = null;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Initialize modelview matrix
	// Apply view position and zoom to modelview matrix
	var vec_scale = vec2.create();
	vec_scale[0] = gl_view_zoom * (1.0 / 1280);
	vec_scale[1] = gl_view_zoom * (gl_canvas_aspect * 1.0 / 1280);
	mat3.fromScaling(mv_matrix, vec_scale);
	mat3.translate(mv_matrix, mv_matrix, gl_view_pos);

    // Camera translation/rotation
    //mat4.multiply(mv_matrix, camera.getLookAtMat(), mv_matrix);

    // Draw Mesh Objects
    // Select Shader Type
    // TODO: Make sure shader is compatible?
    gl.useProgram(shd_prog_mesh_2d);

    for (var i = 0; i < mesh_objs.length; i++) {
        obj = mesh_objs[i];

        // Push modelview matrix
        mv_matrix_stack.push(mat3.copy(mat3.create(),mv_matrix));

        drawMeshObj(obj, shd_prog_mesh_2d);

        // Pop modelview matrix
        mv_matrix = mv_matrix_stack.pop();
    }

	// Draw Pixelmap Objects
	// Select Shader Type
	// TODO: Make sure shader is compatible?
	gl.useProgram(shd_prog_pixelmap_2d);

	for (var i = 0; i < pixelmap_objs.length; i++) {
		obj = pixelmap_objs[i];

		// Push modelview matrix
		mv_matrix_stack.push(mat3.copy(mat3.create(),mv_matrix));

		drawPixelmapObj(obj, shd_prog_pixelmap_2d);

		// Pop modelview matrix
		mv_matrix = mv_matrix_stack.pop();
	}

}
