// Copyright 2017 Cory Douthat
"use strict";

var i_ship_webgl;
var i_ship_phys;
var ship_jet_fg;
var ship_jet_r_fg;
var missiles = [];
var i_missile_mesh;
var i_asteroid_webgl;
var i_asteroid_phys;

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
	LoadTexture("res/asteroids/asteroid.png");

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
	GetPhysObj(i_ship_phys).pos = vec2.fromValues(0.0, -500.0);
	// Collision box
	// vec_temp = vec2.fromValues(98, 84.5);
	// GetPhysObj(i_ship_phys).box = new PhysBox(vec_temp);
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

	// Asteroid
	// WebGL
	i_mesh_temp = AddBoxMesh([200, 200]);
	GetMesh(i_mesh_temp).texture = textures[2];
	i_asteroid_webgl = AddMeshObj(i_mesh_temp);
	// Physics
	i_asteroid_phys = AddPhysObj();
	GetPhysObj(i_asteroid_phys).meshObj = GetMeshObj(i_asteroid_webgl);
	GetPhysObj(i_asteroid_phys).mass_inv = 1.0;
	GetPhysObj(i_asteroid_phys).moment_inv = 1.0;
	// Collision circle
	GetPhysObj(i_asteroid_phys).circle = 180.0;
	GetPhysObj(i_asteroid_phys).bound_r = 180.0;
}

function LaunchMissile(ship_phys)
{
	var missile_temp = new Missile();
	var vel_temp = vec2.fromValues(0.0, 1.0);

    // Set up missile mesh
	missile_temp.i_mesh_obj = AddMeshObj(i_missile_mesh);
    // Set up missile physics
	missile_temp.i_phys_particle = AddPhysParticle();
	GetPhysParticle(missile_temp.i_phys_particle).mass_inv = 1.0;
	GetPhysParticle(missile_temp.i_phys_particle).pos =
		vec2.clone(GetPhysObj(i_ship_phys).pos);
	GetPhysParticle(missile_temp.i_phys_particle).rot =
		GetPhysObj(i_ship_phys).rot;
    GetPhysParticle(missile_temp.i_phys_particle).delete_on_contact = true;

    // Initial position and rotation
	vec2.transformMat3(vel_temp, vel_temp, mat3.fromRotation(mat3.create(),
		GetPhysObj(i_ship_phys).rot));
	vec2.scale(vel_temp, vel_temp, 5000);
	GetPhysParticle(missile_temp.i_phys_particle).vel = vec2.clone(vel_temp);

	missiles.push(missile_temp);
}
