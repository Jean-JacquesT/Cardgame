const sq = require('sqlite3');
sq.verbose();
var express = require('express'),
    app = express(),
    port = parseInt(process.env.PORT, 10) || 8081;
const bodyParser = require('body-parser');
const path = require('path');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fetch = require("node-fetch");
const { stringify } = require('querystring');

// Constants
const PORT = 8082;
const HOST = '0.0.0.0';

// App
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var jsonParser = bodyParser.json();

app.post('/login', jsonParser, (req, res) => {
    console.log(req.body);
    let json = req.body;

    let status = 0;
    let user = json.user;
    let password = json.password;

    const dbPath = path.resolve(__dirname + '/databases/user.db3')
    const db = new sq.Database(dbPath)

    let sql = 'SELECT * FROM user';

    db.all(sql, [], (err, rows) => {
        if (err) {
            status = 0;
        }
        rows.forEach((row) => {
            // console.log(row.email);
            if (row.email == user && row.password == password) {
                //console.log(row.email);
                db.close();
                res.json({ "status": "connected" });
            }
        });
    });
});

app.post('/register', jsonParser, (req, res) => {
    let json = req.body;

    let status = 1;
    let user = json.user;
    let pwd = json.password;
    const dbPath = path.resolve(__dirname + '/databases/user.db3')
    const db = new sq.Database(dbPath)

    let sql = 'SELECT * FROM user';

    if (status == 1) {
        var sql2 = 'INSERT INTO user (email,password) VALUES ("' + user + '","' + pwd + '")';
        console.log(sql2);
        db.run(sql2, function (error) {
            if (error.message.indexOf("already exists") != -1) {
                res.json({ "status": "error", "error_message": "Error during user creation" })
            }
        });
        db.close();
        res.json({ "status": "registered" })
    } else {
        res.json({ "status": "error", "error_message": "user already exist!" })
    }
});

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

app.post('/getdata', jsonParser, (req, res) => {
    //console.log("coucou", req.body)
    var json = req.body;

    //TODO getdata
    let status = 0;
    let user = json.user;
    var db = new sq.Database(__dirname + '/databases/widget.db3');
    let sql = 'SELECT * FROM widget WHERE user="' + user + '"';
    let all_widget = [];
    //get all data of specific user

    db.all(sql, [], (err, rows) => {
        if (err) {
            JSON
            res.json({ "status": "error", "error_message": "Error during select request" });
        }
        console.log('rows = ' + rows.length)
        rows.forEach((row) => {
            // console.log(row);
            let current_row;
            var resultat;
            if (row.type == "meteo") {
                let api_key = "b8a888be06ddbc330e19171652b439f8";
                var url = "https://api.openweathermap.org/data/2.5/weather?q=" + row.options + "&appid=" + api_key;
                var json = JSON.parse(httpGet(url));

                current_row = { "type": row.type, "id": row.id, "location": row.options, "temperature": Math.round(json.main.temp - 273.15) };
            } else if (row.type == "dice") {
                var url = "http://roll.diceapi.com/json/d6";
                var json = JSON.parse(httpGet(url));

                current_row = { "type": row.type, "id": row.id, "url": "http://roll.diceapi.com/images/poorly-drawn/d6/" + json.dice[0].value + ".png" };
            } else if (row.type == "film") {
                let api_key = "1c5212a3cd618ba2d39f58cd88c86c91";
                var url = "https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + row.options;
                var json = JSON.parse(httpGet(url));

                // console.log("test", json)

                current_row = { "type": row.type, "id": row.id, "title": json.results[0].original_title, "description": json.results[0].overview };
            }
            // console.log(current_row)
            // en fonction de type dans row creer le bon json dans all_widget
            all_widget.push(current_row);
            // console.log(all_widget)
        });
        // console.log("coucou2", all_widget)

        res.json(all_widget);
    })
})

app.post('/add_widget', jsonParser, (req, res) => {
    console.log("REQ BODY :", req.body);
    let json = req.body;
    console.log("JSON == :", json);

    // console.log("test 2");
    let status = 0;
    // let user = json.user;
    // let pwd = json.password;
    var db = new sq.Database(__dirname + '/databases/widget.db3');

    if (status == 0) {
        var sql = "INSERT INTO widget (type, options, user) VALUES ('" + json.type + "', '" + json.options + "', '" + json.user + "');";
        console.log("SQL VAR :", sql)
        db.run(sql)
        db.close()
        res.json({ "status": "created" })
    } else {
        res.json({ "status": "error", "error_message": "widget already exist!" })
    }
})

app.post('/edit_widget', jsonParser, (req, res) => {
    let json = req.body;
    console.log("JSON == :", json);

    let status = 0;
    var db = new sq.Database(__dirname + '/databases/widget.db3');

    if (status == 0) {
        var sql = "UPDATE widget SET options = '" + json.options + "' WHERE id = " + json.id + ";";
        console.log("SQL VAR :", sql)
        db.run(sql)
        db.close()
        res.json({ "status": "created" })
    } else {
        res.json({ "status": "error", "error_message": "widget already exist!" })
    }
})

app.post('/remove_widget', jsonParser, (req, res) => {
    let json = req.body;
    console.log("JSON == :", json);

    let status = 0;
    var db = new sq.Database(__dirname + '/databases/widget.db3');

    if (status == 0) {
        var sql = "DELETE FROM widget WHERE id = " + json.id + ";";
        console.log("SQL VAR :", sql)
        db.run(sql)
        db.close()
        res.json({ "status": "created" })
    } else {
        res.json({ "status": "error", "error_message": "widget already exist!" })
    }
});

app.get('/', (req, res) => {
    // ERROR if route is unvalid
    res.send("WORKING !");
});


app.post('/get_widget', jsonParser, (req, res) => {
    console.log("get_widget");

    res.json(
        [{
            "type": "meteo",
            "id": 1,
            "temperature": 35,
            "location": "Lille"
        },
        {
            "type": "dice",
            "id": 2,
            "url": "https://files.cults3d.com/uploaders/13932126/illustration-file/baa0ae82-45b9-4aed-80b9-d4cabd239103/D%C3%A8s%20blanc%20et%20noir_large.PNG"
        },
        {
            "type": "film",
            "id": 3,
            "title": "Hulk",
            "description": "Hulk est vert comme le geant vert"
        },
        {
            "type": "meteo",
            "id": 4,
            "temperature": 35,
            "location": "Lille"
        }
        ])
})


app.listen(PORT); //type