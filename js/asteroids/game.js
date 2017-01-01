// Copyright 2016 Cory Douthat
"use strict";

var ship_webgl_index;
var ship_physics;
var ship_jet_fg;
var ship_jet_r_fg;

function SetupGame()
{
	var mesh_temp;
	var vec_temp;
	var fg_temp;

	// Load textures
	LoadTexture("res/asteroids/ship.png");

	// Create Ship
	// WebGL
	mesh_temp = AddBoxMesh([98, 84.5]);
	GetMesh(mesh_temp).texture = textures[0];
	ship_webgl_index = AddMeshObj(mesh_temp);
	// Physics
	ship_physics = AddPhysObj();
	ship_physics.meshObj = GetMeshObj(ship_webgl_index);
	ship_physics.mass_inv = 1.0;
	ship_physics.moment_inv = 1.0;
	// Collision box
	// vec2.fromValues(vec_temp, 98, 84.5);
	// ship_physics.box = PhysBox(vec_temp);
	// Jet force generator
	ship_jet_fg = new JetFG();
	ship_jet_fg.thrust = vec2.fromValues(0.0, 1000.0);
	AddForceGen(ship_jet_fg, ship_physics);
	// Reverse jet force generator
	ship_jet_r_fg = new JetFG();
	ship_jet_r_fg.thrust = vec2.fromValues(0.0, -1000.0);
	AddForceGen(ship_jet_r_fg, ship_physics);
}
