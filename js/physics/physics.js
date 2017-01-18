// Copyright 2017 Cory Douthat
"use strict";

// UpdatePhysics()
// Update physics system over time interval t (in seconds)
function UpdatePhysics(t)
{
    var i;

    // Contact Detection
    // TODO: Contact detection may have errors
    UpdateContacts(t);

    // TODO: Resolve Contacts

    // Increment Motion
    UpdateMotion(t);

    // Apply Forces
    ApplyForces(t);
}

// UpdateMotion()
// Update position and rotation of objects over interval t (in seconds)
function UpdateMotion(t)
{
    var i, obj;

    for (i in ph_objects)
    {
        obj = ph_objects[i];
        // Update position
        vec2.scaleAndAdd(obj.pos, obj.pos, obj.vel, t);
        // Update rotation
        obj.rot += obj.rot_vel * t;
    }

    for (i in ph_particles)
    {
        obj = ph_particles[i];
        // Update position
        vec2.scaleAndAdd(obj.pos, obj.pos, obj.vel, t);
    }
}
