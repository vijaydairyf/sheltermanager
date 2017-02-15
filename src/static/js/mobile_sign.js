/*jslint browser: true, forin: true, eqeq: true, plusplus: true, white: true, sloppy: true, vars: true, nomen: true, continue: true */
/*global $, jQuery, alert, moment */

// This file is used by the mobile signing pad (mobile.py)

$(document).ready(function() {

    $("#signature").signature({ guideline: true });

    $("#sig-clear").click(function() {
        $("#signature").signature("clear");
    });

    $("#sig-home").click(function() {
        window.location = "mobile";
    });

    $("#sig-refresh").click(function() {
        location.reload();
    });

    $("#sig-logout").click(function() {
        window.location = "mobile_logout";
    });

    $("#sig-sign").click(function() {
        var img = $("#signature canvas").get(0).toDataURL("image/png");
        var formdata = "posttype=sign&ids=%(ids)s&sig=" + encodeURIComponent(img);
            formdata += "&signdate=" + encodeURIComponent(moment().format("YYYY-MM-DD HH:mm:ss"));
            $.ajax({
                type: "POST",
                url: "mobile_post",
                data: formdata,
                dataType: "text",
                mimeType: "textPlain",
                success: function(result) {
                    location.reload();
                },
                error: function(jqxhr, textstatus, response) {
                    $("body").append("<p>" + response + "</p>");
                }
            });
        });
        $("#reviewlink").click(function() { 
            $("#reviewlink").fadeOut();
            $("#review").slideDown(); 
        });

});


