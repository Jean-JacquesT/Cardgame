const express = require('express');
const app = express();

const PORT = 5003;

app.get('/public/js/script.js', function(req, res) {
    res.sendFile(__dirname + "/public/js/script.js");
});

app.get('/public/css/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/css/style.css");
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log('listening on port 5003');
});