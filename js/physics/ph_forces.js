// Copyright 2016 Cory Douthat
"use strict";

//**FORCE GENERATOR REGISTRATION**//

var forces = [];        // Force generator list/registry (ForceReg objs)

var ForceReg = function()
{
    this.force_gen = null;  // Reference to force generator
    this.obj;               // Reference to object, or if null then global
}

// AddForceGen()
// Add a force generator to the force gen registry
function AddForceGen(fg, obj)
{
    var reg = new ForceReg();
    reg.force_gen = fg;
    reg.obj = obj;

    forces.push(reg);

    return fg;
}

// ApplyForces()
// Activate all force generators over time t
function ApplyForces(t)
{
    var i, reg;
    for (i in forces)
    {
        reg = forces[i];
        reg.force_gen.applyForce(reg.obj, t);
    }
}

//********************//
//**FORCE GENERATORS**//

// DNU - empty parent force gen object
var ForceGen = function()
{
    this.applyForce;    // Function to be assigned
}

// TODO: implement inheritance?


// Gravity force generator
var GravFG = function()
{
    this.g = 9.80665;   // Standard acceleration of gravity (m/s^2)
    this.applyForce = function(obj, t)
    {
        if (obj)
        {
            // Individual case
            // Don't apply gravity if mass is infinite
            if (obj.mass_inv > 0.0) {
                obj.vel[1] -= g * t;    // apply acceleration to 'y' component
            }

        }
        else
        {
            // Global case (all objects)
            var i, o;
            for (i in ph_objects)
            {
                o = ph_objects[i];
                // Don't apply gravity if mass is infinite
                if (o.mass_inv > 0.0)
                {
                    o.vel[1] -= this.g * t;    // apply acceleration to 'y' component
                }
            }
        }
    }
}



// Torque (rotation) force generator
var TorqueFG = function(torque)
{
    if (torque)
    {
        this.torque = torque;   // Torque (float)
    }
    else
    {
        this.torque = 0.0;      // Torque (float)
    }
    this.applyForce = function(obj, t)
    {
        if (obj)
        {
            // Individual case
            // Don't apply torque if moment is infinite
            if (obj.moment_inv > 0.0)
            {
                obj.rot_vel += this.torque * obj.moment_inv * t;
            }

        }
        else
        {
            // Global case (all objects)
            var i, o;
            for (i in ph_objects)
            {
                o = ph_objects[i];
                // Don't apply torque if mass is infinite
                if (o.moment_inv > 0.0)
                {
                    o.rot_vel += this.torque * o.moment_inv * t;
                }
            }
        }
    }
}


// Jet (local) force generator
var JetFG = function()
{
    this.thrust = vec2.create();    // Thrust vector (vec2)
    this.offset = vec2.create();    // Offset vector
    this.active = false;            // Active (true/false)
    this.follow_rot = true;         // Follow obj rotation (true/false)
    this.applyForce = function(obj, t)
    {
        var v_delta = vec2.create();
        var thrust_tmp = vec2.clone(this.thrust);

        if (obj && this.active)
        {
            // Individual case
            // Rotate
            if (this.follow_rot)
            {
                vec2.transformMat3(thrust_tmp, thrust_tmp,
                    mat3.fromRotation(mat3.create(),obj.rot));
            }
            // Apply
            if (vec2.length(this.offset) == 0.0)
            {
                // Simple case (center of mass)
                // Don't apply force if mass is infinite
                if (obj.mass_inv > 0.0)
                {
                    vec2.scale(v_delta, thrust_tmp, t * obj.mass_inv);
                    vec2.add(obj.vel, obj.vel, v_delta);
                }
            }
            else
            {
                // Complex case (offset)
                // Don't apply force if mass or moment is infinite
                if (obj.mass_inv > 0.0 && obj.moment_inv > 0.0)
                {
                    // TODO
                }
            }

        }
        else if (this.active)
        {
            // Global case - not defined
        }
    }
}
