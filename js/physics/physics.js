// Copyright 2017 Cory Douthat
"use strict";

// UpdatePhysics()
// Update physics system over time interval t (in seconds)
function UpdatePhysics(t)
{
    var i;

    // Contact Detection
    UpdateContacts(t);

    // Contact Callback function(s) - may delete objects (like particles)
    ContactCallbacks(t);

    // TODO: --Make sure to check if object still exists when resolving
    // Resolve Contacts
    ResolveContacts(t);

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

    // TODO: Check if this works with splice below
    for (i in ph_particles)
    {
        obj = ph_particles[i];

        // Check 'dead' status
        if (obj.dead)
        {
            ph_particles.splice(i, 1);
        }
        else
        {
            // Update position
            vec2.scaleAndAdd(obj.pos, obj.pos, obj.vel, t);
        }
    }
}

// ContactCallbacks()
// Call callback functions for individual and/or all contacts
function ContactCallbacks(t)
{
    // Go through all contacts
    for (var i in contacts)
    {
        // TODO: Check for individual callback function
        if (0)
        {
            // TODO
        }
        // TODO: Check for global callback functions
        else if (0)
        {
            // TODO
        }
    }
}

// ResolveContacts()
// Resolve all contacts from the current cycle
function ResolveContacts(t)
{
    var a, b;

    // Go through all contacts
    for (var i in contacts)
    {
        a = contacts[i].a;
        b = contacts[i].b;

        // TODO: Physics contact resolution

        // Special Particle Actions
        // a object
        if (a instanceof PhysParticle)
        {
            // Check delete_on_contact property
            if (a.delete_on_contact)
            {
                // Mark for deletion
                a.dead = true;
            }
        }
        // b object
        if (b instanceof PhysParticle)
        {
            // Check delete_on_contact property
            if (b.delete_on_contact)
            {
                // Mark for deletion
                b.dead = true;
            }
        }
    }

    // Contact list is reset at beginning of "UpdateContacts" function
}
