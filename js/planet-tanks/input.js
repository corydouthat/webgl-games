// Copyright 2016 Cory Douthat
"use strict";

var last_x;
var last_y;
var mouse_lb;
var mouse_rb;
var mouse_mb;

$(window).ready(function() {
    $("#glcanvas").mousemove(function(event){
        var dx = event.pageX - (last_x || event.pageX);
        var dy = event.pageY - (last_y || event.pageY);

        // Revolve/Orbit Camera
        if(mouse_rb || mouse_mb)
        {
            gl_view_pos[0] += dx * 5 / gl_view_zoom;
            gl_view_pos[1] += -dy * 5 / gl_view_zoom;
        }

        last_x = event.pageX;
        last_y = event.pageY;
    });
    $("#glcanvas").mousedown(function(event){
        switch(event.which){
            case 1:
                mouse_lb = true;
                break;
            case 2:
                mouse_mb = true;
                break;
            case 3:
                mouse_rb = true;
                break;
        }
        return false;
    });
    $(window).mouseup(function(event){
        switch(event.which){
            case 1:
                mouse_lb = false;
                break;
            case 2:
                mouse_mb = false;
                break;
            case 3:
                mouse_rb = false;
                break;
        }
        return false;
    });
    $(document).contextmenu(function(){
        return false;
    });
    $(document).bind("mousewheel DOMMouseScroll", function(event){
        if(event.originalEvent.wheelDelta > 0
            || event.originalEvent.detail < 0)
        {
            // Zoom In Camera
            gl_view_zoom *= 0.9;
        }
        else
        {
            // Zoom Out Camera
            gl_view_zoom *= 1.1;
        }
    })
});
