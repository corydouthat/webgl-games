// Copyright 2017 Cory Douthat
"use strict";

var textures = [];

// LoadTexture()
// Load texture image and buffer
function LoadTexture(img_path)
{
    // Load regular texture
    textures.push(LoadTextureImg(img_path));

    // Load alpha masks
    // TODO: special considerations for mask?
    // TODO: make editable?
}

// LoadTexture()
// Load a single image and create a texture from it
function LoadTextureImg(src)
{
    var index = gl.createTexture();
    // Create temporary blank texture until image loads
    gl.bindTexture(gl.TEXTURE_2D, index);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([255, 255, 255, 255]));
    gl.bindTexture(gl.TEXTURE_2D, null);

    var image = new Image();
    image.onload = function() { BufferTexture(image, index); }
    image.src = src;

    return index;
}

// BufferTexture()
// Create texture from image and buffer
function BufferTexture(image, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // TODO: if power of two texture then
    //gl.generateMipmap(gl.TEXTURE_2D);
    // else disable mipmapping and wrapping
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
