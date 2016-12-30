// Copyright 2016 Cory Douthat
"use strict";

// SolveCramer2()
// Solve a linear system of equations in two variable using Cramer's Rule
function SolveCramer2(A, B, X) {
    var det;
    var Ai;
    var det_ai;

    det = mat3.determinant(A);
    // TODO: Check for near-zero
    // Check for zero
    if (det == 0.0) {
        X = vec3.fromValues(0.0, 0.0, 0.0);
        return false;
    }

    // Solver for first X
    Ai = vec3.clone(A);
    Ai[0] = B[0];
    Ai[1] = B[1];
    det_ai = mat3.determinant(Ai);
    X[0] = det_ai / det;

    // Solve for second x
    Ai = vec3.clone(A);
    Ai[2] = B[0];
    Ai[3] = B[1];
    det_ai = mat3.determinant(Ai);
    X[1] = det_ai / det;

    return true;
}
