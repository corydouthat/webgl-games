// Copyright 2016 Cory Douthat
"use strict";

var i_ship_webgl;
var i_ship_phys;
var ship_jet_fg;
var ship_jet_r_fg;
var missiles = [];
var i_missile_mesh;

var Missile = function()
{
	this.i_mesh_obj = null;
	this.i_phys_particle = null;
}

function SetupGame()
{
	var i_mesh_temp;
	var vec_temp;
	var fg_temp;

	// Load textures
	LoadTexture("res/asteroids/ship.png");
	LoadTexture("res/asteroids/missile.png");

	// Create Ship
	// WebGL
	i_mesh_temp = AddBoxMesh([98, 84.5]);
	GetMesh(i_mesh_temp).texture = textures[0];
	i_ship_webgl = AddMeshObj(i_mesh_temp);
	// Physics
	i_ship_phys = AddPhysObj();
	GetPhysObj(i_ship_phys).meshObj = GetMeshObj(i_ship_webgl);
	GetPhysObj(i_ship_phys).mass_inv = 1.0;
	GetPhysObj(i_ship_phys).moment_inv = 1.0;
	// Collision box
	// vec2.fromValues(vec_temp, 98, 84.5);
	// ship_physics.box = PhysBox(vec_temp);
	// Jet force generator
	ship_jet_fg = new JetFG();
	ship_jet_fg.thrust = vec2.fromValues(0.0, 1000.0);
	AddForceGen(ship_jet_fg, GetPhysObj(i_ship_phys));
	// Reverse jet force generator
	ship_jet_r_fg = new JetFG();
	ship_jet_r_fg.thrust = vec2.fromValues(0.0, -1000.0);
	AddForceGen(ship_jet_r_fg, GetPhysObj(i_ship_phys));

	// Missile mesh
	i_missile_mesh = AddBoxMesh([20, 20]);
	GetMesh(i_missile_mesh).texture = textures[1];
}

function LaunchMissile(ship_phys)
{
	var missile_temp = new Missile();
	var vel_temp = vec2.fromValues(0.0, 1.0);

	missile_temp.i_mesh_obj = AddMeshObj(i_missile_mesh);
	missile_temp.i_phys_particle = AddPhysParticle();
	GetPhysParticle(missile_temp.i_phys_particle).mass_inv = 1.0;
	GetPhysParticle(missile_temp.i_phys_particle).pos =
		vec2.clone(GetPhysObj(i_ship_phys).pos);
	GetPhysParticle(missile_temp.i_phys_particle).rot =
		GetPhysObj(i_ship_phys).rot;

	vec2.transformMat3(vel_temp, vel_temp, mat3.fromRotation(mat3.create(),
		GetPhysObj(i_ship_phys).rot));
	vec2.scale(vel_temp, vel_temp, 50);
	GetPhysParticle(missile_temp.i_phys_particle).vel = vec2.clone(vel_temp);

	missiles.push(missile_temp);
}
