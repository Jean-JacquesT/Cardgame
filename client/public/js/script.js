var user = "";
var password = "";

document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector(".dashboard").style.display = "none";
    // document.querySelector(".login").style.display = "none";
    // fill_dashboard();

    var login_button = document.querySelector(".login-input");
    var register_button = document.querySelector(".register-input");

    // Login
    login_button.addEventListener("click", function () {
        user = document.querySelector("#username").value;
        password = document.querySelector("#password").value;
        var data = {
            "user": document.querySelector("#username").value,
            "password": document.querySelector("#password").value
        };
        data = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:8082/login", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send(data);
        xhr.addEventListener('load', e => {
            var json = JSON.parse(xhr.responseText);
            if (json.status == "connected") {
                document.querySelector(".login").style.display = "none";
                document.querySelector(".dashboard").style.display = "block";
                fill_dashboard();
            } else {
                document.querySelector("#username").value = "";
                document.querySelector("#password").value = "";
                document.querySelector(".error").innerHTML = "Username - Password Incorrect";
                document.querySelector(".error").style.opacity = 1;
                setTimeout(() => {
                    document.querySelector(".error").style.opacity = 0;
                }, 5000);
            }
        });
    });

    //Register
    register_button.addEventListener("click", function () {
        var data = {
            "user": document.querySelector("#username").value,
            "password": document.querySelector("#password").value
        };
        data = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:8082/register", true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send(data);
        xhr.addEventListener('load', e => {
            var json = JSON.parse(xhr.responseText);
            if (json.status == "registered") {
                document.querySelector(".login").style.display = "none";
                document.querySelector(".dashboard").style.display = "block";
                fill_dashboard();
            } else {
                document.querySelector("#username").value = "";
                document.querySelector("#password").value = "";
                document.querySelector(".error").innerHTML = "Username already taken";
                document.querySelector(".error").style.opacity = 1;
                setTimeout(() => {
                    document.querySelector(".error").style.opacity = 0;
                }, 5000);
            }
        });
    });
});

function fill_dashboard() {
    var nbr_of_widget;
    var add_widget = document.querySelector(".add_widget");
    var widget_type = document.querySelector(".widget_type");
    add_widget.addEventListener("click", function () {
        if (add_widget.innerHTML == "+") {
            widget_type.style.opacity = 1;
            add_widget.innerHTML = "-";
        } else {
            widget_type.style.opacity = 0;
            add_widget.innerHTML = "+";
        }
    });

    var dashboard_container = document.querySelector(".dashboard-container");
    dashboard_container.innerHTML = "";

    // Get Widget
    var data = {
        "user": user,
    };
    data = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8082/getdata", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.send(data);
    xhr.addEventListener('load', e => {
        var widget = JSON.parse(xhr.responseText);
        nbr_of_widget = widget.length;
        for (let i = 0; i < nbr_of_widget; i++) {
            console.log(nbr_of_widget)
            if (widget[i].type == "meteo") {
                var div = `
                    <div class="meteo widget` + widget[i].id + `">
                        <span class="remove_widget" id=` + widget[i].id + `>x</span>
                        <div class="meteo_answer">` + widget[i].temperature + `°C</div>
                        <form autocomplete="off">
                            <input type="text" name="input" class="meteoinput" id=` + widget[i].id + ` value=` + widget[i].location + ` placeholder="City">
                            <span class="submitMeteo">OK</div>
                        </form>
                    </div>
                `;
            } else if (widget[i].type == "dice") {
                var div = `
                    <div class="dice widget` + widget[i].id + `">
                        <span class="remove_widget" id=` + widget[i].id + `>x</span>
                        <img src=` + widget[i].url + ` width="200px"><br><br>
                        <input type="submit" value="ROLL" class="submit">
                    </div>
                `;
            } else if (widget[i].type == "film") {
                var div = `
                    <div class="film widget` + widget[i].id + `">
                        <span class="remove_widget" id=` + widget[i].id + `>x</span>
                        <input type="text" name="film" class="filminput" id=` + widget[i].id + ` placeholder="Film name" value="` + widget[i].title + `">
                        <div>
                            <span class=submitFilm>OK</span><br><br>
                            <class="film_description"><strong><left>Description:</left></strong><br>` + widget[i].description + `</div>
                        </div>
                    `;
            }
            dashboard_container.innerHTML += div;
        }
    });

    setTimeout(() => {
        var submitMeteo = document.querySelectorAll(".submitMeteo");
        var meteoInput = document.querySelectorAll(".meteoinput");
        if (submitMeteo) {
            for (let i = 0; i < submitMeteo.length; i++) {
                submitMeteo[i].addEventListener("click", function () {
                    var data = {
                        "id": meteoInput[i].id,
                        "options": meteoInput[i].value
                    };
                    data = JSON.stringify(data);
                    console.log("edit", submitMeteo[i].id)
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://127.0.0.1:8082/edit_widget", true);
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    xhr.send(data);
                    setTimeout(() => { fill_dashboard(); }, 1000);
                });
            }
        }
    }, 2000);

    setTimeout(() => {
        var submitFilm = document.querySelectorAll(".submitFilm");
        var filmInput = document.querySelectorAll(".filminput");
        if (submitFilm) {
            for (let i = 0; i < submitFilm.length; i++) {
                submitFilm[i].addEventListener("click", function () {
                    var data = {
                        "id": filmInput[i].id,
                        "options": filmInput[i].value
                    };
                    data = JSON.stringify(data);
                    console.log("edit", submitFilm[i].id)
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://127.0.0.1:8082/edit_widget", true);
                    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    xhr.send(data);
                    setTimeout(() => { fill_dashboard(); }, 1000);
                });
            }
        }
    }, 2000);


    var submit_button = document.querySelectorAll(".submit");
    for (let i = 0; i < submit_button.length; i++) {
        submit_button[i].addEventListener("click", function () {
            var data = [];
            for (let i = 1; i < nbr_of_widget + 1; i++) {
                var id = ".widget" + i;
                var widget = document.querySelector(id);
                if (widget.classList[0] == "meteo") {
                    data[i] = {
                        "id": i,
                        "type": "meteo",
                        "location": widget.querySelector(".meteoinput" + i).value,
                        "temperature": ""
                    };
                } else if (widget.classList[0] == "dice") {
                    data[i] = {
                        "id": i,
                        "type": "dice",
                        "url": ""
                    };
                } else if (widget.classList[0] == "film") {
                    data[i] = {
                        "id": i,
                        "type": "film",
                        "title": widget.querySelector(".filminput" + i).value,
                        "description": ""
                    };
                }
            }
            // Update Widget
            data = JSON.stringify(data);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:8082/update_widget", true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(data);
            fill_dashboard();
        });
    }

    var add_meteo_widget = document.querySelector("div.meteo_type");
    if (add_meteo_widget) {
        add_meteo_widget.addEventListener("click", function () {
            // requete back : add_widget("meteo");
            console.log("test 1");
            var data = {
                "user": user,
                "password": password,
                "type": "meteo",
                "options": "Bordeaux"
            };
            data = JSON.stringify(data);
            console.log(data);
            // Remove Widget;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:8082/add_widget", true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(data);
            console.log("test 3");
            setTimeout(() => { fill_dashboard(); }, 1000);
        });
    }
    var add_dice_widget = document.querySelector("div.dice_type");
    if (add_dice_widget) {
        add_dice_widget.addEventListener("click", function () {
            // requete back : add_widget("dice");
            var data = {
                "user": user,
                "password": password,
                "type": "dice",
                "options": ""
            };
            data = JSON.stringify(data);
            // Remove Wideget;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:8082/add_widget", true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(data);
            setTimeout(() => { fill_dashboard(); }, 1000);
        });
    }
    var add_film_widget = document.querySelector("div.film_type");
    if (add_film_widget) {
        add_film_widget.addEventListener("click", function () {
            // requete back : add_widget("film");
            var data = {
                "user": user,
                "password": password,
                "type": "film",
                "options": "Hulk"
            };
            data = JSON.stringify(data);
            console.log(data)
            // Remove Wideget;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:8082/add_widget", true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(data);
            setTimeout(() => { fill_dashboard(); }, 1000);
        });
    }

    setTimeout(() => {
        var remove_widget = document.querySelectorAll("span.remove_widget");
        console.log(remove_widget)
        for (let i = 0; i < remove_widget.length; i++) {
            remove_widget[i].addEventListener("click", function () {
                var data = {
                    "user": user,
                    "password": password,
                    "id": remove_widget[i].id
                };
                data = JSON.stringify(data);
                console.log("remove", remove_widget[i].id)
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:8082/remove_widget", true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.send(data);
                setTimeout(() => { fill_dashboard(); }, 1000);
            });
        }
    }, 2000);
}