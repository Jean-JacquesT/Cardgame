
var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {
    $scope.username = "";
});

// var xmlhttp = new XMLHttpRequest();
// var theUrl = "url server";
// xmlhttp.open("POST", theUrl);
// xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

$(document).ready(function(){
    $("div.dashboard").hide();
    $("button.addWidget").hide();
    $("div.widgetType").hide();
    
    $("button.SignIn").click(function(){
        var user = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        // xmlhttp.send(JSON.stringify({ "function":"connexion", "user":user,"password":password }));
        // var response = xmlhttp.response;
        // var json = JSON.parse(response);
        // if (json.status == "connected") {
            $("div.dashboard").show();
            $("button.addWidget").show();
            $("div.auth").hide();
            // xmlhttp.send(JSON.stringify({ "function":"getdata", "user":user }));
            // var response = xmlhttp.response;
            // for (let index = 0; index < response.nbr_of_widget; index++) {
            for (let index = 0; index < 8; index++) {
                // if (response.widget_type == "meteo") {
                    $("div.widgetContainer").append('<div class="widget"></div>');
                    $("div.widget").last().append("<div>Meteo + response.city</div>");
                    $("div.widget").last().append('<div style="font-size:350%;">12°C</div>');
                    $("div.widget").last().append('<input style ="border:none; border-radius:10px; text-align:center; width: 50%;" placeholder="City"></input>');
                // } else if (reponse.widget_type == "humidity") {
                    // $("div.widgetContainer").append('<div class="widget"></div>');
                    // $("div.widget").last().append("<div>Meteo + response.city</div>");
                    // $("div.widget").last().append('<div style="font-size:350%;">response.humidity%</div>');
                    // $("div.widget").last().append('<input style ="border:none; border-radius:10px; text-align:center; width: 50%;" placeholder="City"></input>');
                // } else {}
            }
        // }
    });

    $("button.addWidget").click(function(){
        $("div.widgetType").show();
    });

    $("button.typeMeteo").click(function(){
        // requete add meteo widget
        $("div.widgetType").hide();
        $("div.widgetContainer").append('<div class="widget"></div>');
        $("div.widget").last().append("<div>Meteo Paris</div>");
        $("div.widget").last().append('<div style="font-size:350%;">12°C</div>');
        $("div.widget").last().append('<input style ="border:none; border-radius:10px; text-align:center; width: 50%;" placeholder="City"></input>');
    });

    $("button.typeHumidity").click(function(){
        // requete add humidity widget
        $("div.widgetType").hide();
        $("div.widgetContainer").append('<div class="widget"></div>');
        $("div.widget").last().append("<div>Humidity Paris</div>");
        $("div.widget").last().append('<div style="font-size:350%;">Humidity paris%</div>');
        $("div.widget").last().append('<input style ="border:none; border-radius:10px; text-align:center; width: 50%;" placeholder="City"></input>');
    })
});
