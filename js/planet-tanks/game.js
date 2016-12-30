// Copyright 2016 Cory Douthat
"use strict";

var background;
var foreground;
var pixelmap;
var tank;

function SetupGame()
{
	var mesh_temp;

	// Create background
	mesh_temp = AddBoxMesh([1280, 720]);
	GetMesh(mesh_temp).texture = textures[0];
	background = AddMeshObj(mesh_temp);

	// Create foreground
	mesh_temp = AddBoxMesh([1280, 720]);
	GetMesh(mesh_temp).texture = textures[1];
	foreground = AddMeshObj(mesh_temp);

	// Create planets (to replace foreground)
	// Test pixelmap
	pixelmap = AddPixelmapObj([1280, 720]);
	GetPixelmapObj(pixelmap).texture = textures[2];
	GetPixelmapObj(pixelmap).mask = textures[3];

	// Create tanks

}
