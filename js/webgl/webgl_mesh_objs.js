// Copyright 2016 Cory Douthat
"use strict";

var mesh_objs = [];                 // Array of mesh objects
var meshes = [];                    // Array of meshes (can be shared by objects)

var MeshObj = function()
{
    this.pos = null;               // Position (vec3) of center
    this.rot = null;               // Rotation (quat)
    this.mesh = null;              // Mesh index
}

var Mesh = function()
{
    this.half_size = null;         // Dimensions half-size
    this.vArray = null;            // GL vertex array buffer ID
    this.vElementsArray = null;    // GL vertex indices array buffer ID (faces)
    this.vTexCoordsArray = null;   // GL tex coords array buffer ID
	this.texture = null;           // Texture ID
    this.numIndices = null;        // Size of elements array
}

function drawMeshObj(obj, shader_program)
{
    var mesh = GetMesh(obj.mesh);
    var m_matrix = mat3.create();   // model matrix
    var mv_uniform;
    var vertex_pos_attrib;
    var tex_coord_attrib;

    // Object translation/rotation
    mat3.fromRotation(m_matrix, obj.rot);
    mat3.translate(m_matrix, m_matrix, obj.pos);
    mat3.multiply(mv_matrix, mv_matrix, m_matrix);

    // Set mv_matrix uniform
    mv_uniform = gl.getUniformLocation(shader_program, "mv_matrix");
    gl.uniformMatrix3fv(mv_uniform, false, new Float32Array(mv_matrix));

    // Set array pointers
    // Vertices
    vertex_pos_attrib = gl.getAttribLocation(shader_program, "a_vertex");
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vArray);
    gl.vertexAttribPointer(vertex_pos_attrib, 2, gl.FLOAT, false, 0, 0);
    // Texture coordinates
    tex_coord_attrib = gl.getAttribLocation(shader_program, "a_texcoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vTexCoordsArray);
    gl.vertexAttribPointer(tex_coord_attrib, 2, gl.FLOAT, false, 0, 0);
    // Elements array
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vElementsArray);

    // Texture
    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mesh.texture);
    // Set texture sampler uniform value
    gl.uniform1i(gl.getUniformLocation(shader_program, "t_diffuse"), 0);

    // Draw elements
    gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
}

Mesh.prototype.makeBoxMesh = function(vec_half_size)
{
    this.half_size = vec_half_size;

    var x = vec_half_size[0];
    var y = vec_half_size[1];

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

    this.numIndices = 6;

    // Create buffers
    this.vArray = gl.createBuffer();
    this.vTexCoordsArray = gl.createBuffer();
    this.vElementsArray = gl.createBuffer();

    // Buffer vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vArray);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v_array), gl.STATIC_DRAW);

    // Buffer texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vTexCoordsArray);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_array), gl.STATIC_DRAW);

    // Buffer element indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vElementsArray);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elem_array), gl.STATIC_DRAW);
};

// AddMeshObj()
// Create a mesh object by passing an existing mesh index
function AddMeshObj(mesh_index)
{
    var obj = new MeshObj();

    obj.pos = vec2.create();
    obj.rot = 0.0;
    obj.mesh = mesh_index;

    return mesh_objs.push(obj) - 1;
}

// AddBoxObj()
// Create a box and add it to the mesh objects array
function AddBoxObj(vec_half_size)
{
    var obj = new MeshObj();

    obj.pos = vec2.create();
    obj.rot = 0.0;
    obj.mesh = meshes.push(Mesh.makeBoxMesh(vec_half_size)) - 1;

    return mesh_objs.push(obj) - 1;
}

// AddBoxMesh()
// Create a box mesh and add it to the meshes array
function AddBoxMesh(vec_half_size)
{
    var mesh = new Mesh();
    mesh.makeBoxMesh(vec_half_size);

    return meshes.push(mesh) - 1;
}

// GetMesh
// Get a mesh by index
function GetMesh(index)
{
    return meshes[index];
}

// GetMeshObj()
// Get an object by index
function GetMeshObj(index)
{
    return mesh_objs[index];
}
