// Copyright 2017 Cory Douthat
"use strict";

var contacts = [];      // Holds contacts (collisions) for current frame

var contact = function()
{
    this.a = null;      // Object A
    this.b = null;      // Object B
    this.points = [];   // Contact point(s) (vec2 in global coordinates??)
}

// UpdateContacts()
// Detect contacts between all objects over time period t
function UpdateContacts(t)
{
    // TODO: Spacial and Hierarchical Partitioning (Grid, BVH, etc.)
    // TODO: Group related contacts (i.e. A<->B, B<->C, and C<->D) for simultaneous processing
    // TODO: Consider resting contacts
    // TODO: Consider contact resolution ordering
    // TODO: Enable particles (particle boolean or bound_r = 0?)
    // TODO: Enable/Disable collision checking per-object
    var i;      // Index A
    var j;      // Index B
    var a_obj;  // Object A
    var b_obj;  // Object B

    // Reset contacts list
    contacts.splice(0,contacts.length);

    // Check Object Pairs

    for (i = 0; i < ph_objects.length; i++)
    {
        for (j = i + 1; j < ph_objects.length; j++)
        {
            a_obj = ph_objects[i];
            b_obj = ph_objects[j];
            CheckContactPair(a_obj, b_obj, t);
        }
    }

    // Check particle-obj pairs
    for (i = 0; i < ph_particles.length; i++)
    {
        for (j = 0; j < ph_objects.length; j++)
        {
            a_obj = ph_particles[i];
            b_obj = ph_objects[j];
            CheckContactParticleObj(a_obj, b_obj, t);
        }
    }
}

// CheckContactPair()
// Check for contacts between the designated object pair over time t
function CheckContactPair(a_obj, b_obj, t)
{
    // TODO: Object validity checks
    var a_br = a_obj.bound_r;       // Bounding radius A
    var b_br = b_obj.bound_r;       // Bounding radius B
    var a_trl = a_obj.vel * t;      // Translation vector A
    var b_trl = b_obj.vel * t;      // Translation vector B
    var a_pos0 = a_obj.pos;         // Initial Position A
    var b_pos0 = b_obj.pos;         // Initial Position B
    var d0 = b_pos0 - a_pos0;       // Initial distance/separation from A to B


    // Check Bounding Circles
    if (a_br && b_br)
    {
        // Rough bounding circles check
        if (d0 > a_br + vec2.len(a_trl) + b_br + vec2.len(b_trl))
        {
            return;
        }

        // TODO: Swept bounding circles check

    }

    // Check Circle
    if (a_obj.circle)
    {

        if (b_obj.circle)
        {
            // TODO: CheckContactCircleCircle(a_obj, b_obj, t);
        }

        else if (b_obj.box)
        {
            // TODO: CheckContactCircleBox(a_obj, b_obj, t);
        }

        else if (b_obj.mesh)
        {
            // TODO: CheckContactCircleMesh(a_obj, b_obj, t);
        }

        return;
    }

    // OR

    // Check Box
    if (a_obj.box)
    {

        if (b_obj.circle)
        {
            // TODO: CheckContactBoxCircle(a_obj, b_obj, t);
        }

        else if (b_obj.box)
        {
            CheckContactBoxBox(a_obj, b_obj, t);
        }

        else if (b_obj.mesh)
        {
            // TODO: CheckContactBoxMesh(a_obj, b_obj, t);
        }

        return;
    }

    // OR

    // Check Mesh
    if (a_obj.mesh)
    {

        if (b_obj.circle)
        {
            // TODO: CheckContactMeshCircle(a_obj, b_obj, t);
        }

        else if (b_obj.box)
        {
            // TODO: CheckContactMeshBox(a_obj, b_obj, t);
        }

        else if (b_obj.mesh)
        {
            // TODO: CheckContactMeshMesh(a_obj, b_obj, t);
        }

        return;
    }

}

// CheckContactParticleObj()
// Check for contacts between the designated particle and object over time t
function CheckContactParticleObj(a_particle, b_obj, t)
{
    // TODO: Object validity checks

    var b_br = b_obj.bound_r;       // Bounding radius B
    var a_trl = a_particle.vel * t; // Translation vector A
    var b_trl = b_obj.vel * t;      // Translation vector B
    var a_pos0 = a_particle.pos;    // Initial Position A
    var b_pos0 = b_obj.pos;         // Initial Position B
    var d0 = b_pos0 - a_pos0;         // Initial distance/Separation from A to B


    // Check Bounding Circles
    if (b_br)
    {
        // Rough bounding circles check
        if (d0 > b_br + vec2.len(a_trl) + vec2.len(b_trl))
        {
            return;
        }

        // TODO: Swept bounding circles check

    }

    // Check Circle
    if (b_obj.circle)
    {
        CheckContactParticleCircle(a_particle, b_obj, t);
        return;
    }

    // OR

    // Check Box
    if (b_obj.box)
    {
        // TODO: CheckContactParticleBox(a_particle, b_obj, t);
        return;
    }

    // OR

    // Check Mesh
    if (b_obj.mesh)
    {
        // TODO: CheckContactParticleMesh(a_particle, b_obj, t);
        return;
    }

}

// CheckContactBoxBox()
// Check for contact(s) between two objects with box collision primitives
function CheckContactBoxBox(a_obj, b_obj, t)
{
    // TODO: Check for maximum linearized movement distance and reduce timestep if needed
    // TODO: Check that contacts have positive closing velocity relative to each edge
    // TODO: See about using SIMD for multiple vertex/vector transformations

    // Raw box half-width and half-height
    var a_hw = a_obj.box.hw;
    var a_hh = a_obj.box.hh;
    var b_hw = b_obj.box.hw;
    var b_hh = b_obj.box.hh;

    var a_trfm;                 // Transform mat box corner to vertex in object space A
    var b_trfm;                 // Transform mat box corner to vertex in object space B
    var a_obj_trfm0;            // Transform vertices in A to global coordinates (time 0)
    var b_obj_trfm0;            // Transform vertices in B to global coordinates (time 0)
    var a_obj_trfm1;            // Transform vertices in A to global coordinates (time 1)
    var b_obj_trfm1;            // Transform vertices in B to global coordinates (time 1)
    var a_obj_trfm0_inv;        // Inverse
    var b_obj_trfm0_inv;        // Inverse
    var a_obj_trfm1_inv;        // Inverse
    var b_obj_trfm1_inv;        // Inverse
    var ab_trfm0;               // Transform mat vertices in A to object space B (time 0)
    var ba_trfm0;               // Transform mat vertices in B to object space A (time 0)
    var ab_trfm1;               // Transform mat vertices in A to object space B (time 0)
    var ba_trfm1;               // Transform mat vertices in B to object space A (time 0)
    var v0;                     // Temporary vertex at time 0
    var v1;                     // Temporary vertex at time t
    var e0;                     // Temporary edge vertex 0
    var e1;                     // Temporary edge vertex 1
    var p;                      // Point of intersection
    var temp_contact;           // Temporary contact

    // Raw box vertices
    var a_p = [vec2.fromValues(a_hw, a_hh),
               vec2.fromValues(-a_hw, a_hh),
               vec2.fromValues(-a_hw, -a_hh),
               vec2.fromValues(a_hw, -a_hh)];
    var b_p = [vec2.fromValues(b_hw, b_hh),
               vec2.fromValues(-b_hw, b_hh),
               vec2.fromValues(-b_hw, -b_hh),
               vec2.fromValues(b_hw, -b_hh)];

    // Transform box vertices into object space
    // A object
    if (a_obj.rot)
    {
        mat3.fromRotation(a_trfm, a_obj.rot);

        if (a_obj.offset)
        {
            mat3.translate(a_trfm, a_obj.offset);
        }

        for (var i in a_p)
        {
            vec2.transformMat3(a_p[i],a_p[i],a_trfm);
        }
    }
    else if (a_obj.offset)
    {
        for (var i in a_p)
        {
            vec2.add(a_p[i], a_p[i], a_obj.offset);
        }
    }
    // B object
    if (b_obj.rot)
    {
        mat3.fromRotation(b_trfm, b_obj.rot);

        if (b_obj.offset)
        {
            mat3.translate(b_trfm, b_obj.offset);
        }

        for (var i in b_p)
        {
            vec2.transformMat3(b_p[i],b_p[i],b_trfm);
        }
    }
    else if (b_obj.offset)
    {
        for (var i in b_p)
        {
            vec2.add(b_p[i], b_p[i], b_obj.offset);
        }
    }

    // TRANSFORMATION MATRICES
    // A object trasformation matrix (time 0)
    if (a_obj.rot)
    {
        mat3.fromRotation(a_obj_trfm0, a_obj.rot);
    }
    else
    {
        mat3.identity(a_obj_trfm0);
    }

    if (a_obj.pos)
    {
        mat3.translate(a_obj_trfm0, a_obj_trfm0, a_obj.pos);
    }

    // A object trasformation matrix (time 1)
    if (a_obj.rot_vel)
    {
        mat3.rotate(a_obj_trfm1, a_obj.rot_vel * t);
    }
    else
    {
        mat3.clone(a_obj_trfm1, a_obj_trfm0);
    }

    if (a_obj.vel)
    {
        mat3.translate(a_obj_trfm1, a_obj_trfm1, a_obj.vel * t);
    }

    // B object trasformation matrix (time 0)
    if (b_obj.rot)
    {
        mat3.fromRotation(b_obj_trfm0, b_obj.rot);
    }
    else
    {
        mat3.identity(b_obj_trfm0);
    }

    if (b_obj.pos)
    {
        mat3.translate(b_obj_trfm0, b_obj_trfm0, b_obj.pos);
    }

    // B object trasformation matrix (time 1)
    if (b_obj.rot_vel)
    {
        mat3.rotate(b_obj_trfm1, b_obj.rot_vel * t);
    }
    else
    {
        mat3.clone(b_obj_trfm1, b_obj_trfm0);
    }

    if (b_obj.vel)
    {
        mat3.translate(b_obj_trfm1, b_obj_trfm1, b_obj.vel * t);
    }

    // Matrix to transform vertices into object space of B (time 0)
    mat3.invert(b_obj_trfm0_inv, b_obj_trfm0);
    mat3.multiply(ab_trfm0, b_obj_trfm0_inv, a_obj_trfm0);
    // Matrix to transform vertices into object space of B (time 1)
    mat3.invert(b_obj_trfm1_inv, b_obj_trfm1);
    mat3.multiply(ab_trfm1, b_obj_trfm1_inv, a_obj_trfm1);
    // Matrix to transform vertices into object space of A (time 0)
    mat3.invert(a_obj_trfm0_inv, a_obj_trfm0);
    mat3.multiply(ba_trfm0, a_obj_trfm0_inv, b_obj_trfm0);
    // Matrix to transform vertices into object space of A (time 1)
    mat3.invert(a_obj_trfm1_inv, a_obj_trfm1);
    mat3.multiply(ba_trfm1, a_obj_trfm1_inv, b_obj_trfm1);

    temp_contact = null;
    // CHECK A VERTICES VS B EDGES (B STATIONARY)
    // ---
    // Check each pair
    for (var v in a_p)
    {
        vec2.transformMat3(v0, a_p[v], ab_trfm0);
        vec2.transformMat3(v1, a_p[v], ab_trfm1);

        for (var e in b_p)
        {
            e0 = b_p[e];
            if (e < b_p.length)
            {
                e1 = b_p[e+1];
            }
            else {
                e1 = b_p[0];
            }

            if (CheckIntSegSeg(v0, v1, e0, e1, p))
            {
                // Add Contact
                if (temp_contact)
                {
                    temp_contact.points.push(p.clone);
                }
                else
                {
                    temp_contact = new contact;
                    temp_contact.a = a_obj;
                    temp_contact.b = b_obj;
                    temp_contact.points.push(p.clone);
                }
            }
        }
    }

    // CHECK B VERTICES VS A EDGES (A STATIONARY)
    // ---
    // Check each pair
    for (var v in b_p)
    {
        vec2.transformMat3(v0, b_p[v], ba_trfm0);
        vec2.transformMat3(v1, b_p[v], ba_trfm1);

        for (var e in a_p)
        {
            e0 = a_p[e];
            if (e < a_p.length)
            {
                e1 = a_p[e+1];
            }
            else
            {
                e1 = a_p[0];
            }

            if (CheckIntSegSeg(v0, v1, e0, e1, p))
            {
                // Add Contact
                if (temp_contact)
                {
                    temp_contact.points.push(p.clone);
                }
                else
                {
                    temp_contact = new contact;
                    temp_contact.a = a_obj;
                    temp_contact.b = b_obj;
                    temp_contact.points.push(p.clone);
                }
            }
        }
    }

    if (temp_contact)
    {
        contacts.push(temp_contact);
    }

}

// CheckContactParticleCircle()
// Check for contact(s) between a particle and a circle collision primitive
function CheckContactParticleCircle(a_particle, b_obj, t)
{
    var a0, a1, b0, b1, p;
    var a1 = vec2.create();
    var b1 = vec2.create();
    var p = vec2.create();
    var temp_contact;
    // Calculate begin and end points
    a0 = vec2.clone(a_particle.pos);
    b0 = vec2.clone(b_obj.pos);
    vec2.add(a1, a_particle.pos, vec2.scale(vec2.create(), a_particle.vel, t));
    vec2.add(b1, b_obj.pos, vec2.scale(vec2.create(), b_obj.vel, t));

    if (CheckIntSegCircle(a0, a1, b0, b1, b_obj.circle, p))
    {
        temp_contact = new contact;
        temp_contact.a = a_particle;
        temp_contact.b = b_obj;
        temp_contact.points.push(p.clone);

        contacts.push(temp_contact);

        return true;
    }
    else
    {
        return false;
    }
}

// CheckIntSegSeg()
// Check for intersection between two line segments defined by end points
function CheckIntSegSeg(a0, a1, b0, b1, p)
{
    var a;      // Line a
    var b;      // Line b
    var A;      // Cramer's Rule A
    var B;      // Cramer's Rule B
    var X;      // Cramer's Rule X
    var a_dot_b;
    var temp;

    vec2.subtract(a, a1, a0);
    vec2.subtract(b, b1, b0);

    a_dot_b = vec2.dot(a, b);

    A = mat2.fromValues(vec2.sqrLen(a), a_dot_b,
                        -a_dot_b, vec2.sqrlen(b));
    B = vec2.fromValues(vec2.dot(b0 - a0, a),
                        vec2.dot(b0 - a0, b));

    if (SolveCramer2(A, B, X))
    {
        if (X[0] >= 0 && X[0] <= 1 &&
            X[1] >= 0 && X[1] <= 1)
        {
            vec2.scale(temp, a, X[0]);
            p = vec2.add(a0, temp);
            return true;
        }
        else
        {
            p = undefined;
            return false
        }

    }
    else
    {
        throw("Division by zero in Cramer's Rule");
        p = undefined;
        return false;
    }
}

// CheckIntSegCircle()
// Check for intersection between a line segment and a circle
// a0, a1 - beginning and end of particle path
// b0, b1 - beginning and end of circle center path
// r - radius of circle
// Return: p - first point of contact
function CheckIntSegCircle(a0, a1, b0, b1, r, p)
{
    // Calculate 'a' path relative to 'b'
    var a0_rel = vec2.subtract(vec2.create(), a0, b0);
    var a1_rel = vec2.subtract(vec2.create(), a1, b1);

    // Based on MathWorld Circle-Line Intersection Article
    // http://mathworld.wolfram.com/Circle-LineIntersection.html

    // Line-circle intersection variables
    var dx = a1_rel[0] - a0_rel[0];
    var dy = a1_rel[1] - a0_rel[1];
    var dr = Math.sqrt(dx*dx + dy*dy);
    var d_mat = mat2.fromValues(a0_rel[0], a0_rel[1], a1_rel[0], a1_rel[1]);
    var d_det = mat2.determinant(d_mat);
    var discriminant = r*r * dr*dr - d_det*d_det;
    var discr_sqrt;
    var x_num1, x_num2, y_num1, y_num2;
    var p1 = vec2.create();
    var p2 = vec2.create();
    var dx1, dx2, dy1, dy2;
    var t;

    // Check discriminant
    if (discriminant < 0.0)
    {
        // No intersection
        p = null;
        return false;
    }
    else
    {
        // Calculate equation parts
        discr_sqrt = Math.sqrt(discriminant);
        x_num1 = d_det * dy;
        if (dy < 0)
        {
            x_num2 = dx * discr_sqrt;
        }
        else
        {
            x_num2 = -dx * discr_sqrt;
        }
        y_num1 = -d_det * dx;
        y_num2 = Math.abs(dy) * discr_sqrt;

        // TODO: Check if collision is within segment length (below)

        // Final solution(s)
        if (discriminant == 0.0)
        {
            // Tangent case - one solution
            p[0] = x_num1 / (dr*dr);
            p[1] = y_num1 / (dr*dr);

            // Back-calculate absolute position
            // Determine "tiem of intersection"
            t = vec2.len(vec2.subtract(vec2.create(), p, a0_rel)) /
                vec2.len(vec2.subtract(vec2.create(), a1_rel, a0, rel));

            // Check if contact is within time step
            if (t >= 0 && t <= 1)
            {
                // Calculate absolute position
                vec2.add(p, a0,
                    vec2.scale(vec2.create(),
                    vec2.subtract(vec2.create(), a1, a0),
                    t));

                return true;
            }
            else
            {
                p = null;
                return false;
            }
        }
        else
        {
            // Non-tangent - two solutions
            p1[0] = (x_num1 + x_num2) / (dr*dr);
            p1[1] = (y_num1 + y_num2) / (dr*dr);
            p2[0] = (x_num1 - x_num2) / (dr*dr);
            p2[1] = (y_num1 - y_num2) / (dr*dr);

            // Determine first-occuring solution
            dx1 = p1[0] - a0_rel[0];
            dx2 = p2[0] - a0_rel[0];
            dy1 = p1[1] - a0_rel[1];
            dy2 = p2[1] - a0_rel[1];

            // TODO: do t calculations first and use to check for first-occurring
            // TODO: re-use length calculations for efficiency

            if ((dx1*dx1 + dy1*dy1) <= (dx2*dx2 + dy2*dy2))
            {
                // First-occuring solution is '1'
                // Calculate "t"
                t = Math.sqrt(dx1*dx1 + dy1*dy1) / Math.sqrt(dx*dx + dy*dy);

                // Check if contact is within time step
                if (t >= 0 && t <= 1)
                {
                    // Calculate absolute position
                    vec2.add(p, a0,
                        vec2.scale(vec2.create(),
                        vec2.subtract(vec2.create(), a1, a0),
                        t));

                    return true;
                }
                else
                {
                    p = null;
                    return false;
                }
            }
            else
            {
                // First-occuring solution is '2'
                // Calculate "t"
                t = Math.sqrt(dx2*dx2 + dy2*dy2) / Math.sqrt(dx*dx + dy*dy);

                // Check if contact is within time step
                if (t >= 0 && t <= 1)
                {
                    // Calculate absolute position
                    vec2.add(p, a0,
                        vec2.scale(vec2.create(),
                        vec2.subtract(vec2.create(), a1, a0),
                        t));

                    return true;
                }
                else
                {
                    p = null;
                    return false;
                }
            }
        }
    }
}
