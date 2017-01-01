// Copyright 2016 Cory Douthat
"use strict";

var PhysObj = function()
{
    this.pos = vec2.create();   // Position (vec2)
    this.rot = 0.0;             // Rotation (float radians)
    this.mass_inv = 0.0;        // Inverse mass (float)
    this.moment_inv = 0.0;      // Inverse moment of inertia (float)
    this.vel = vec2.create();   // Velocity (vec2)
    this.rot_vel = 0.0;         // Rotational velocity (float radians/s)
    this.bound_r = null;        // Bounding radius (float)
    this.circle = null;         // Circle primitive (float radius)
    this.box = null;            // Box primitive (vec2 half-size)
    this.mesh = null;           // Physics/collision mesh
    this.meshObj = null;        // Reference to associated WebGL mesh obj
}

var PhysParticle = function()
{
    this.pos = vec2.create();   // Position (vec2)
    this.mass_inv = 0.0;        // Inverse mass (float)
    this.vel = vec2.create();   // Velocity (vec2)
}

// hs = half-size (vec2)
var PhysBox = function(hs)
{
    if (hs == null)
    {
        this.half_size = vec2.create(); // half-size (vec2)
    }
    else
    {
        this.half_size = hs; // half-size (vec2)
    }
    this.offset = vec2.create();    // Offset from object center (vec2)
    this.rot = 0;                   // Rotation (float radians)
}
