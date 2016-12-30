// Copyright 2016 Cory Douthat
"use strict";

var pixelmap_objs = [];                 // Array of pixelmap objects

var PixelmapObj = function()
{
    this.half_size = null;          // Dimensions half-size
    this.pos = null;                // Position (vec3) of center
    this.texture = null;			// Image texture ID
    this.mask = null;				// Alpha mask texture ID
    this.vArray = null;             // GL vertex array buffer ID
    this.vElementsArray = null;     // GL vertex indices array buffer ID (faces)
    this.vTexCoordsArray = null;    // GL tex coords array buffer IDs
    this.numIndices = null;         // Size of elements array
}

function drawPixelmapObj(obj, shader_program)
{
    var m_matrix = mat3.create();   // model matrix
    var mv_uniform;
    var vertex_pos_attrib;
    var tex_coord_attrib;

    // Object translation
    mat3.fromTranslation(m_matrix, obj.pos);
    mat3.multiply(mv_matrix, mv_matrix, m_matrix);

    // Set mv_matrix uniform
    mv_uniform = gl.getUniformLocation(shader_program, "mv_matrix");
    gl.uniformMatrix3fv(mv_uniform, false, new Float32Array(mv_matrix));

    // Set array pointers
    // Vertices
    vertex_pos_attrib = gl.getAttribLocation(shader_program, "a_vertex");
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vArray);
    gl.vertexAttribPointer(vertex_pos_attrib, 2, gl.FLOAT, false, 0, 0);
    // Texture coordinates
    tex_coord_attrib = gl.getAttribLocation(shader_program, "a_texcoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vTexCoordsArray);
    gl.vertexAttribPointer(tex_coord_attrib, 2, gl.FLOAT, false, 0, 0);
    // Elements array
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vElementsArray);

    // Texture
    // Bind foreground texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, obj.texture);
    // Set texture sampler uniform value
    gl.uniform1i(gl.getUniformLocation(shader_program, "t_diffuse"), 0);

    // Bind mask texture
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, obj.mask);
    // Set texture sampler uniform value
    gl.uniform1i(gl.getUniformLocation(shader_program, "t_mask"), 0);

    // Draw elements
    gl.drawElements(gl.TRIANGLES, obj.numIndices, gl.UNSIGNED_SHORT, 0);
}

function AddPixelmapObj(vec_half_size)
{
    var obj = new PixelmapObj();
    var x = vec_half_size[0];
    var y = vec_half_size[1];

    // Parameters
    obj.half_size = vec_half_size;
    obj.pos = vec2.create();

    // Textures defined by calling function

    // GLSL Arrays
    // Vertex array
    var v_array =
    [
        x, y,       // top-right
        -x, y,      // top-left
        -x, -y,     // bottom-left
        x, -y       // bottom-right
    ];

    // Texture coordinates (UV) array
    var uv_array = [
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];

    // Element array
    var elem_array =
    [
        0,  1,  2,
        0,  2,  3
    ];

    obj.numIndices = 6;

    // Create buffers
    obj.vArray = gl.createBuffer();
    obj.vTexCoordsArray = gl.createBuffer();
    obj.vElementsArray = gl.createBuffer();

    // Buffer vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vArray);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v_array), gl.STATIC_DRAW);

    // Buffer texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vTexCoordsArray);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_array), gl.STATIC_DRAW);

    // Buffer element indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vElementsArray);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elem_array), gl.STATIC_DRAW);

    return pixelmap_objs.push(obj) - 1;
}

// GetPixelmapObj()
// Get an object by index
function GetPixelmapObj(index)
{
    return pixelmap_objs[index];
}
