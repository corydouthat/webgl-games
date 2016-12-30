// Copyright 2016 Cory Douthat
"use strict";

var shd_prog_mesh_2d;
var shd_prog_pixelmap_2d;

// InitShaders()
// Load and initialize WebGL shaders
function InitShaders()
{
	var vertex_shader;
	var fragment_shader;

	// 2D Mesh Shader
	if ((vertex_shader = LoadShader(gl, "shd_mesh_2d_vs")) != null &&
	(fragment_shader = LoadShader(gl, "shd_mesh_2d_fs")) != null)
	{
		shd_prog_mesh_2d = gl.createProgram();
		if(InitShader(shd_prog_mesh_2d, vertex_shader, fragment_shader))
		{
			InitShaderMesh2D(shd_prog_mesh_2d);
		}
		else
		{
			throw("could not initialize mesh shader");
			return false;
		}
	}
	else
	{
		throw("could not load mesh shader code");
		return false;
	}

	// Pixel Map Shader
	if ((vertex_shader = LoadShader(gl, "shd_pixelmap_2d_vs")) != null &&
	(fragment_shader = LoadShader(gl, "shd_pixelmap_2d_fs")) != null)
	{
		shd_prog_pixelmap_2d = gl.createProgram();
		if(InitShader(shd_prog_pixelmap_2d, vertex_shader, fragment_shader))
		{
			InitShaderPixelmap2D(shd_prog_pixelmap_2d);
		}
		else
		{
			throw("could not initialize pixelmap shader");
			return false;
		}
	}
	else
	{
		throw("could not load pixelmap shader code")
		return false;
	}

	// Background Shader

	// Default Shader Program
	gl.useProgram(shd_prog_mesh_2d);

    return true;
}

// InitShader()
// Generic initializatoin of a single shader
function InitShader(shader_program, vertex_shader, fragment_shader)
{
	// Link the shader program
	gl.attachShader(shader_program, vertex_shader);
	gl.attachShader(shader_program, fragment_shader);
	gl.linkProgram(shader_program);

	// Check if linking was successful
	if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS))
	{
		throw("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader_program));
        return false;
	}
	else
	{
		return true;
	}
}

// InitShaderMesh2D
// Specific initialization for 2D mesh shader
function InitShaderMesh2D(shader_program)
{
	var vertex_pos_attrib;
	var tex_coord_attrib;

	vertex_pos_attrib = gl.getAttribLocation(shader_program, "a_vertex");
	gl.enableVertexAttribArray(vertex_pos_attrib);

	tex_coord_attrib = gl.getAttribLocation(shader_program, "a_texcoord");
	gl.enableVertexAttribArray(tex_coord_attrib);
}

// InitShaderPixelmap2D
// Specific initialization for pixelmap shader
function InitShaderPixelmap2D(shader_program)
{
	var vertex_pos_attrib;
	var tex_coord_attrib;

	vertex_pos_attrib = gl.getAttribLocation(shader_program, "a_vertex");
	gl.enableVertexAttribArray(vertex_pos_attrib);

	tex_coord_attrib = gl.getAttribLocation(shader_program, "a_texcoord");
	gl.enableVertexAttribArray(tex_coord_attrib);
}

// LoadShader()
// Pull shader source code from DOM (document)
function LoadShader(gl, id)
{
    var shader_script, shader_src, current_child, shader;

    shader_script = document.getElementById(id);

    if (!shader_script)
    {
        return null;
    }

    shader_src = "";
    current_child = shader_script.firstChild;

    while (current_child)
    {
        if (current_child.nodeType == current_child.TEXT_NODE)
        {
            shader_src += current_child.textContent;
        }

        current_child = current_child.nextSibling;
    }

    if (shader_script.type == "x-shader/x-fragment")
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shader_script.type == "x-shader/x-vertex")
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else
    {
        // Unknown shader type
        return null;
    }

    gl.shaderSource(shader, shader_src);

    // Compile the shader program
    gl.compileShader(shader);

    // Check if shader compiled properly
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        throw("An error occurred compiling the shaders:" + gl. getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
