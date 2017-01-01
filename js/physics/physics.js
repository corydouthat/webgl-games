// Copyright 2016 Cory Douthat
"use strict";

var ph_objects = [];

// AddPhysObj()
// Add a physics object
function AddPhysObj(ph_obj)
{
    if (ph_obj == null)
    {
        ph_obj = new PhysObj();
    }
    ph_objects.push(ph_obj);
    return ph_obj;
}

// UpdatePhysics()
// Update physics system over time interval t (in seconds)
function UpdatePhysics(t)
{
    // Contact Detection
    UpdateContacts(t);

    // TODO: Resolve Contacts


    // Increment Motion
    UpdateMotion(t);

    // Apply Forces
    ApplyForces(t);

    // TODO: TEMPORARY BANDAID
    // Synchronize
    GetMeshObj(ship_webgl_index).pos = ship_physics.pos;
    GetMeshObj(ship_webgl_index).rot = ship_physics.rot;
}

// UpdateMotion()
// Update position and rotation of objects over interval t (in seconds)
function UpdateMotion(t)
{
    var i, obj;

    for (i in ph_objects) {
        obj = ph_objects[i];
        // Update position
        vec2.scaleAndAdd(obj.pos, obj.pos, obj.vel, t);
        // Update rotation
        obj.rot += obj.rot_vel * t;

        // TEMPORARY (TODO) - transfer pos and rot to 3D WebGL objects
        obj.meshObj.pos[0] = obj.pos[0];
        obj.meshObj.pos[1] = obj.pos[1];
        quat.rotateZ(obj.meshObj.rot, obj.meshObj.rot, obj.rot_vel * t);
    }
}
